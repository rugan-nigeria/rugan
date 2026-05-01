import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAnalytics);

export default router;
