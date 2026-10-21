require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../src/models/Game');
const games = require('./games.json');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const ops = games.map((game) => ({
    updateOne: {
      filter: { steamAppId: game.steamAppId },
      update: { $set: game },
      upsert: true,
    },
  }));

  const result = await Game.bulkWrite(ops);
  console.log(`Insertados: ${result.upsertedCount} | Actualizados: ${result.modifiedCount}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});