const express = require("express");
const multer = require("multer");


const { uploadFile } = require("../controllers/upload.controller");
const { downloadFile } = require("../controllers/download.controller");
const { fileInfo } = require("../controllers/info.controller");
const limiter = require("../middleware/ratelimit");

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 2000 * 1024 * 1024 // 2GB (Telegram limit)
  }
});

router.post("/upload", upload.single("file"), uploadFile);
router.get("/d/:token", limiter, downloadFile);
router.get("/info/:token", fileInfo);

router.get("/health", (req,res)=>res.send("OK"));

module.exports = router;