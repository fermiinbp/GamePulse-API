require("dotenv").config({ quiet: true });

const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const { connectDB } = require("./config/db");
const logger = require("./middlewares/logger");
const manejarErrores = require("./middlewares/manejarErrores");

const routerAuth = require("./routes/auth.routes");
const routerGames = require("./routes/game.routes");
const routerReviews = require("./routes/review.routes");
const routerAdmin = require("./routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(logger);

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Comprobar que la API está levantada
 *     responses:
 *       200:
 *         description: La API responde
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 */
app.get("/api/health", (req, res) => res.json({ status: "ok" }));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req, res) => res.redirect("/api-docs"));

app.use("/api/auth", routerAuth);
app.use("/api/games", routerGames);
app.use("/api/reviews", routerReviews);
app.use("/api/admin", routerAdmin);

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.use(manejarErrores);

async function arrancar() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación en http://localhost:${PORT}/api-docs`);
  });
}

arrancar().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
