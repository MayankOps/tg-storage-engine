const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const mime = require("mime-types");
const https = require("https");
const http = require("http");

const { BOT_TOKEN, CHANNEL_ID } = require("../config/env");

// Create new agents for each request to avoid connection reuse issues
function createHttpsAgent() {
  return new https.Agent({
    keepAlive: false,
    maxSockets: 10,
    maxFreeSockets: 5
  });
}

function createHttpAgent() {
  return new http.Agent({
    keepAlive: false,
    maxSockets: 10,
    maxFreeSockets: 5
  });
}

// Retry logic for failed requests
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation errors
      if (error.response?.status === 400 || error.response?.status === 401) {
        throw error;
      }
      
      // Only retry on connection errors
      if (attempt < maxRetries && (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT')) {
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else if (attempt === maxRetries) {
        break;
      }
    }
  }
  
  throw lastError;
}

async function uploadToTelegram(filePath, originalName) {

  if (!BOT_TOKEN || !CHANNEL_ID) {
    throw new Error("BOT_TOKEN or CHANNEL_ID is not configured. Check your .env file.");
  }

  return retryWithBackoff(async () => {
    const form = new FormData();

    form.append("chat_id", CHANNEL_ID);

    form.append("document", fs.createReadStream(filePath), {
      filename: originalName,
      contentType:
        mime.lookup(originalName) || "application/octet-stream"
    });

    try {
      const res = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        form,
        {
          headers: form.getHeaders(),
          httpAgent: createHttpAgent(),
          httpsAgent: createHttpsAgent(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 60000 // 60 seconds per request
        }
      );

      if (!res.data.ok) {
        throw new Error(`Telegram API error: ${res.data.description}`);
      }

      return res.data.result.document;
    } catch (error) {
      console.error("Upload to Telegram error:", error.message);
      
      if (error.response) {
        throw new Error(`Telegram API error: ${error.response.status} - ${error.response.data?.description || error.message}`);
      }
      
      throw error;
    }
  });
}

async function getFilePath(file_id) {

  if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not configured. Check your .env file.");
  }

  return retryWithBackoff(async () => {
    try {
      const res = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile`,
        {
          params: { file_id },
          httpAgent: createHttpAgent(),
          httpsAgent: createHttpsAgent(),
          timeout: 30000 // 30 seconds
        }
      );

      if (!res.data.ok) {
        throw new Error(`Telegram API error: ${res.data.description}`);
      }

      return res.data.result.file_path;
    } catch (error) {
      console.error("GetFile from Telegram error:", error.message);
      
      if (error.response) {
        throw new Error(`Telegram API error: ${error.response.status} - ${error.response.data?.description || error.message}`);
      }
      
      throw error;
    }
  });
}

module.exports = {
  uploadToTelegram,
  getFilePath
};
