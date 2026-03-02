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

    const token = generateToken();

    // ✅ SAVE ORIGINAL NAME (NOT Telegram name)
    db.run(
      `INSERT INTO files(token,file_id,file_name,file_size)
       VALUES(?,?,?,?)`,
      [
        token,
        tgFile.file_id,
        file.originalname, // ⭐ FIX HERE
        tgFile.file_size
      ]
    );

    // delete temp upload
    fs.unlinkSync(file.path);

    res.json({
      success: true,
      token,
      download: `/file/${token}`
    });

  } catch (e) {
    console.error("UPLOAD ERROR:", e.message);

    res.status(500).json({
      error: "Upload failed",
      details: e.message
    });
  }
};