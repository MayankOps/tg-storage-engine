const db = require("../config/database");
const axios = require("axios");
const mime = require("mime-types");
const https = require("https");
const { BOT_TOKEN } = require("../config/env");
const { getFilePath } = require("../services/telegram.service");

// Helper to create fresh HTTPS agent
function createHttpsAgent() {
  return new https.Agent({
    keepAlive: false,
    maxSockets: 10,
    maxFreeSockets: 5
  });
}

exports.downloadFile = (req, res) => {

  db.get(
    "SELECT * FROM files WHERE token=?",
    [req.params.token],
    async (err, row) => {

      if (err) {
        console.error("DATABASE ERROR:", err.message);
        return res.status(500).json({
          error: "Database error",
          details: err.message
        });
      }

      if (!row) {
        return res.status(404).json({ error: "Invalid or expired link" });
      }

      try {
        const file_path = await getFilePath(row.file_id);

        const telegramURL =
          `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`;

        const tgResponse = await axios({
          url: telegramURL,
          method: "GET",
          responseType: "stream",
          httpsAgent: createHttpsAgent(),
          timeout: 300000
        });

        // ✅ correct MIME type
        const contentType =
          mime.lookup(row.file_name) || "application/octet-stream";

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${row.file_name}"`
        );

        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Length", tgResponse.headers["content-length"] || "");

        // Increment download count
        db.run(
          "UPDATE files SET downloads = downloads + 1 WHERE token = ?",
          [req.params.token]
        );

        // Handle stream errors
        tgResponse.data.on("error", (err) => {
          console.error("Telegram stream error:", err.message);
          if (!res.headersSent) {
            res.status(500).json({
              error: "Download failed",
              details: err.message
            });
          } else {
            res.end();
          }
        });

        res.on("error", (err) => {
          console.error("Response stream error:", err.message);
          tgResponse.data.destroy();
        });

        tgResponse.data.pipe(res);

      } catch (e) {
        console.error("DOWNLOAD ERROR:", e.message);
        if (e.code === "ECONNRESET") {
          return res.status(503).json({
            error: "Download failed",
            details: "Connection to Telegram API was reset. Please try again."
          });
        }
        res.status(500).json({
          error: "Download failed",
          details: e.message
        });
      }
    }
  );
};