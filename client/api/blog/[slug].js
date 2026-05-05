import { readFile } from "fs/promises";
import path from "path";

const DEFAULT_TITLE = "RUGAN | Empowering Rural Girls";
const DEFAULT_DESCRIPTION =
  "Empowering rural girl-children through education, mentorship, and advocacy.";
const DEFAULT_IMAGE_PATH = "/images/homepage/Hero.jpg";

function getOrigin(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "https")
    .split(",")[0]
    .trim();
  const forwardedHost = String(req.headers["x-forwarded-host"] || req.headers.host || "rugan.org")
    .split(",")[0]
    .trim();

  return `${forwardedProto}://${forwardedHost}`;
}

function normalizeApiBaseUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const withoutTrailingSlash = raw.replace(/\/+$/, "");
  return withoutTrailingSlash.endsWith("/api")
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
}

function toAbsoluteUrl(value, origin) {
  const raw = String(value || "").trim();
  if (!raw) return `${origin}${DEFAULT_IMAGE_PATH}`;

  if (/^(?:[a-z]+:)?\/\//i.test(raw) || raw.startsWith("data:")) {
    return raw;
  }

  return new URL(raw, origin).toString();
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, maxLength) {
  const text = stripHtml(value);
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildJsonLd(article, url, image, description) {
  const authorName = article.authorName || article.author?.name || "RUGAN Team";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    image: [image],
    url,
    datePublished: article.publishedAt || article.createdAt || undefined,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "RUGAN",
      logo: {
        "@type": "ImageObject",
        url: new URL("/icons/rugan-logo.jpg", url).toString(),
      },
    },
  };

  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

function buildDynamicHead(article, origin) {
  const isArticle = Boolean(article?.slug);
  const title = article?.title ? `${article.title} | RUGAN` : DEFAULT_TITLE;
  const description = truncate(article?.excerpt || DEFAULT_DESCRIPTION, 200) || DEFAULT_DESCRIPTION;
  const image = toAbsoluteUrl(article?.coverImage || DEFAULT_IMAGE_PATH, origin);
  const url = isArticle ? `${origin}/blog/${article.slug}` : `${origin}/blog`;
  const authorName = article?.authorName || article?.author?.name || "RUGAN Team";
  const publishedAt = article?.publishedAt ? new Date(article.publishedAt).toISOString() : "";
  const tags = Array.isArray(article?.tags) ? article.tags.filter(Boolean) : [];
  const jsonLd = isArticle ? buildJsonLd(article, url, image, description) : "";
  const articleTags = tags
    .map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`)
    .join("\n    ");

  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:site_name" content="RUGAN" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="${isArticle ? "article" : "website"}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    ${publishedAt ? `<meta property="article:published_time" content="${escapeHtml(publishedAt)}" />` : ""}
    ${isArticle ? `<meta property="article:author" content="${escapeHtml(authorName)}" />` : ""}
    ${articleTags}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
  `.trim();
}

function injectDynamicHead(html, dynamicHead) {
  const strippedHtml = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:site_name"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:title"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:description"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:type"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:url"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:image"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:image:alt"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="twitter:card"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="twitter:title"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="twitter:description"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="twitter:image"[\s\S]*?>/i, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?>/i, "");

  return strippedHtml.replace("</head>", `    ${dynamicHead}\n  </head>`);
}

async function readBuiltIndexHtml(origin) {
  const distPath = path.resolve(process.cwd(), "dist", "index.html");

  try {
    return await readFile(distPath, "utf8");
  } catch {
    const response = await fetch(`${origin}/`);
    if (!response.ok) {
      throw new Error(`Failed to load index HTML: ${response.status}`);
    }

    return response.text();
  }
}

async function fetchArticleMetadata(slug) {
  const apiBaseUrl = normalizeApiBaseUrl(
    process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
  );

  if (!apiBaseUrl || !slug) {
    return { status: 200, article: null };
  }

  const response = await fetch(`${apiBaseUrl}/blog/posts/${encodeURIComponent(slug)}/metadata`);

  if (!response.ok) {
    return { status: response.status, article: null };
  }

  const payload = await response.json();
  return { status: 200, article: payload?.data || null };
}

export default async function handler(req, res) {
  const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug;
  const origin = getOrigin(req);

  try {
    const [baseHtml, metadata] = await Promise.all([
      readBuiltIndexHtml(origin),
      fetchArticleMetadata(slug),
    ]);

    const html = injectDynamicHead(baseHtml, buildDynamicHead(metadata.article, origin));
    const status = metadata.status === 404 ? 404 : 200;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.status(status).send(html);
  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.status(500).send(
      `<!DOCTYPE html><html lang="en"><head><title>${escapeHtml(
        DEFAULT_TITLE,
      )}</title></head><body><p>${escapeHtml(error.message)}</p></body></html>`,
    );
  }
}
