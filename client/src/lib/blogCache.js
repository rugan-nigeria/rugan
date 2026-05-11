import api from "@/lib/api";

const BLOG_CACHE_PREFIX = "rugan-blog-posts-v1";
const BLOG_CACHE_SOFT_TTL_MS = 5 * 60 * 1000;
const BLOG_CACHE_HARD_TTL_MS = 24 * 60 * 60 * 1000;

const memoryCache = new Map();
const inflightRequests = new Map();

function getCacheKey(limit) {
  return `${BLOG_CACHE_PREFIX}:${limit}`;
}

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function normalizePosts(posts) {
  return Array.isArray(posts) ? posts : [];
}

function readCacheRecord(limit = 12) {
  const key = getCacheKey(limit);
  const now = Date.now();

  const cachedInMemory = memoryCache.get(key);
  if (cachedInMemory) {
    const age = now - cachedInMemory.cachedAt;
    if (age <= BLOG_CACHE_HARD_TTL_MS) {
      return {
        ...cachedInMemory,
        isStale: age > BLOG_CACHE_SOFT_TTL_MS,
      };
    }
    memoryCache.delete(key);
  }

  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const cachedAt = Number(parsed?.cachedAt);
    const data = normalizePosts(parsed?.data);
    const age = now - cachedAt;

    if (!Number.isFinite(cachedAt) || age > BLOG_CACHE_HARD_TTL_MS) {
      window.sessionStorage.removeItem(key);
      return null;
    }

    const record = { cachedAt, data };
    memoryCache.set(key, record);

    return {
      ...record,
      isStale: age > BLOG_CACHE_SOFT_TTL_MS,
    };
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

function writeCacheRecord(limit, posts) {
  const key = getCacheKey(limit);
  const record = {
    cachedAt: Date.now(),
    data: normalizePosts(posts),
  };

  memoryCache.set(key, record);

  if (!canUseSessionStorage()) {
    return record.data;
  }

  try {
    window.sessionStorage.setItem(key, JSON.stringify(record));
  } catch {
    // Ignore storage quota failures and keep the in-memory cache.
  }

  return record.data;
}

export function getCachedBlogPosts(limit = 12) {
  return readCacheRecord(limit)?.data || [];
}

export async function fetchLatestBlogPosts(limit = 12) {
  const key = getCacheKey(limit);

  if (inflightRequests.has(key)) {
    return inflightRequests.get(key);
  }

  const request = api
    .get("/blog/posts", {
      params: {
        limit,
        includePagination: false,
      },
    })
    .then((response) => writeCacheRecord(limit, response.data?.data || []))
    .finally(() => {
      inflightRequests.delete(key);
    });

  inflightRequests.set(key, request);
  return request;
}

export function preloadBlogPageModule() {
  return import("@/pages/BlogPage");
}

export function preloadBlogResources(limit = 12) {
  void preloadBlogPageModule();

  const cached = readCacheRecord(limit);
  if (cached && !cached.isStale) {
    return;
  }

  void fetchLatestBlogPosts(limit).catch(() => {});
}
