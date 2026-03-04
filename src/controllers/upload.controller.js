const db = require("../config/database");
const fs = require("fs");
const { uploadToTelegram } = require("../services/telegram.service");
const { generateToken } = require("../services/token.service");

exports.uploadFile = async (req, res) => {

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Upload using ORIGINAL filename
    const tgFile = await uploadToTelegram(
      file.path,
      file.originalname
    );

    // ✅ Generate unique token based on filename
    const token = await generateToken(file.originalname);

    // ✅ SAVE ORIGINAL NAME (NOT Telegram name)
    db.run(
      `INSERT INTO files(token,file_id,file_name,file_size)
       VALUES(?,?,?,?)`,
      [
        token,
        tgFile.file_id,
        file.originalname,
        tgFile.file_size
      ],
      (err) => {
        // Delete temp upload first
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {
          console.error("Error deleting temp file:", unlinkErr.message);
        }

        if (err) {
          console.error("DATABASE ERROR:", err.message);
          return res.status(500).json({
            error: "Failed to save file info",
            details: err.message
          });
        }

        res.json({
          success: true,
          token,
          download: `/api/file/${token}`
        });
      }
    );

  } catch (e) {
    console.error("UPLOAD ERROR:", e.message);

    // Clean up temp file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Error deleting temp file:", unlinkErr.message);
      }
    }

    res.status(500).json({
      error: "Upload failed",
      details: e.message
    });
  }
};