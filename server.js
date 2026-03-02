const app = require("./src/app");
const { PORT } = require("./src/config/env");
const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


app.listen(PORT, () =>
  console.log(`TG Storage Engine running on port ${PORT}`)
);

process.on("unhandledRejection", err => {
  console.error("UNHANDLED:", err);
});