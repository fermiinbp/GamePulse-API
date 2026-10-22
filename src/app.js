require("./models/User");
require("./models/Game");

const express = require("express");
const manejarErrores = require("./middlewares/manejarErrores");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/games", require("./routes/game.routes"));

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.use(manejarErrores);

module.exports = app;