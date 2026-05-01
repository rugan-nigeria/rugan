import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { protect } from "../middleware/auth.js";

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "rugan-uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/upload/image
// Returns { url } pointing to the Cloudinary asset
router.post("/image", protect, upload.single("image"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }
    // req.file.path contains the secure Cloudinary URL
    res.json({ success: true, url: req.file.path });
  } catch (err) {
    next(err);
  }
});

export default router;
