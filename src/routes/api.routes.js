const express = require("express");
const multer = require("multer");

const { uploadFile } = require("../controllers/upload.controller");
const { downloadFile } = require("../controllers/download.controller");
const { fileInfo } = require("../controllers/info.controller");
const { uploadLimiter, downloadLimiter } = require("../middleware/ratelimit");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 2000 * 1024 * 1024 // 2GB (Telegram limit)
  }
});

// Upload file with rate limiting
router.post("/upload", uploadLimiter, upload.single("file"), uploadFile);

// Download file with lenient rate limiting
router.get("/file/:token", downloadLimiter, downloadFile);

// Legacy download route (optional)
router.get("/d/:token", downloadLimiter, downloadFile);

// File info
router.get("/info/:token", fileInfo);

// Health check
router.get("/health", (req, res) => res.send("OK"));

module.exports = router;