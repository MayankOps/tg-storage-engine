const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const mime = require("mime-types");
const https = require("https");

const { BOT_TOKEN, CHANNEL_ID } = require("../config/env");

const httpsAgent = new https.Agent({
  keepAlive: false
});

async function uploadToTelegram(filePath, originalName) {

  const form = new FormData();

  form.append("chat_id", CHANNEL_ID);

  form.append("document", fs.createReadStream(filePath), {
    filename: originalName,
    contentType:
      mime.lookup(originalName) || "application/octet-stream"
  });

  const res = await axios.post(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
    form,
    {
      headers: form.getHeaders(),
      httpsAgent,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 0
    }
  );

  return res.data.result.document;
}

async function getFilePath(file_id) {

  const res = await axios.get(
    `https://api.telegram.org/bot${BOT_TOKEN}/getFile`,
    {
      params: { file_id },
      httpsAgent
    }
  );

  return res.data.result.file_path;
}

module.exports = {
  uploadToTelegram,
  getFilePath
};