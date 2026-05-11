import { Router } from "express";
import {
  getPosts,
  getPostMetadata,
  getPost,
  getAdminPosts,
  getAdminPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/blog.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { cacheControl, noCache } from "../middleware/cache.js";

const router = Router();

// Public routes are cacheable at the browser/CDN edge.
router.get("/posts", cacheControl({ maxAge: 60, staleWhileRevalidate: 300 }), getPosts);
router.get(
  "/posts/:slug/metadata",
  cacheControl({ maxAge: 300, staleWhileRevalidate: 1800 }),
  getPostMetadata,
);
router.get("/posts/:slug", cacheControl({ maxAge: 120, staleWhileRevalidate: 600 }), getPost);

// Admin routes and mutations should never be cached.
router.get("/admin/posts", protect, noCache(), getAdminPosts);
router.get("/admin/posts/:id", protect, noCache(), getAdminPost);

router.post("/posts", protect, noCache(), createPost);
router.put("/posts/:id", protect, noCache(), updatePost);
router.delete("/posts/:id", protect, adminOnly, noCache(), deletePost);

export default router;
