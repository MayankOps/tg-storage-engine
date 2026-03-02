const db = require("../config/database");
const axios = require("axios");
const mime = require("mime-types");
const { BOT_TOKEN } = require("../config/env");
const { getFilePath } = require("../services/telegram.service");

exports.downloadFile = (req, res) => {

  db.get(
    "SELECT * FROM files WHERE token=?",
    [req.params.token],
    async (err, row) => {

      if (!row) {
        return res.status(404).send("Invalid link");
      }

      try {
        const file_path = await getFilePath(row.file_id);

        const telegramURL =
          `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`;

        const tgResponse = await axios({
          url: telegramURL,
          method: "GET",
          responseType: "stream"
        });

        // ✅ correct MIME type
        const contentType =
          mime.lookup(row.file_name) || "application/octet-stream";

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${row.file_name}"`
        );

        res.setHeader("Content-Type", contentType);

        tgResponse.data.pipe(res);

      } catch (e) {
        console.error("DOWNLOAD ERROR:", e.message);
        res.status(500).send("Download failed");
      }
    }
  );
};