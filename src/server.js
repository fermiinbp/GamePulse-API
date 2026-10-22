require("dotenv").config({ quite: true });

require("./models/User");
require("./models/Game");

const routerUser = require("./routes/user.routes");
const { connectDB } = require("./config/db.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/user", routerUser);
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

app.use(express.json());
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
