require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  BOT_TOKEN: process.env.BOT_TOKEN,
  CHANNEL_ID: process.env.CHANNEL_ID
};