const express = require("express");
const routes = require("./routes/api.routes");
const path = require("path");


const app = express();
app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ limit: "2gb", extended: true }));

app.use(express.json());
app.use("/api", routes);

app.use(express.static(path.join(__dirname, "../public")));


module.exports = app;