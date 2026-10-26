require("./models/Game");
require("./models/GameStat");

const express = require("express");
const swaggerUi = require("swagger-ui-express");              // Swagger
const swaggerSpec = require("./config/swagger");              // Swagger
const manejarErrores = require("./middlewares/manejarErrores");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/games", require("./routes/game.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.use(manejarErrores);

module.exports = app;