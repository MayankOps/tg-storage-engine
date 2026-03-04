const express = require("express");
const cors = require("cors");
const path = require("path");

const apiRoutes = require("./routes/api.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend if you have a public folder
app.use(express.static(path.join(__dirname, "../public")));

// Mount API routes
app.use("/api", apiRoutes);

module.exports = app;