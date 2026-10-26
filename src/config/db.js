const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  });
  console.log("MongoDB conectado");
}

async function desconectar() {
  await mongoose.disconnect();
}

module.exports = { connectDB, desconectar };
