require("dotenv").config();
const mongoose = require("mongoose");
const Game = require("../src/models/Game");
const User = require("../src/models/User");
const games = require("./games.json");
const users = require("./users.json");

async function dropIfExists(model) {
  try {
    await model.collection.drop();
    console.log(`Colección "${model.collection.name}" eliminada`);
  } catch (err) {
    // 26 = NamespaceNotFound: la colección aún no existe, no es un error real
    if (err.code !== 26) throw err;
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  });

  // 1. Eliminar colecciones (incluye los índices antiguos)
  await dropIfExists(Game);
  await dropIfExists(User);

  // 2. Recrear colecciones e índices según los schemas actuales
  await Game.syncIndexes();
  await User.syncIndexes();

  // 3. Insertar datos nuevos
  const resultGames = await Game.insertMany(games);
  const resultUsers = await User.insertMany(users);

  console.log(`Juegos insertados: ${resultGames.length}`);
  console.log(`Usuarios insertados: ${resultUsers.length}`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
