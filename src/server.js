require("dotenv").config({ quite: true });
const express = require("express");
require("./models/User");

const routerAuth = require("./routes/auth.routes.js");
const { connectDB } = require("./config/db.js");
const logger = require("./middleware/logger.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use("/auth", routerAuth);

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

async function arrancar() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Conectada y corriendo en http://localhost:${PORT}`);
  });
}

arrancar().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
