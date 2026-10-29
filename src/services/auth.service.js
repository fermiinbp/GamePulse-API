const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generarToken(usuario) {
  console.log("JWT_EXPIRES_IN:", JSON.stringify(process.env.JWT_EXPIRES_IN));
  return jwt.sign(
    {
      id: usuario.id,
      role: usuario.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
}

async function registrar({ username, email, password }) {
  const usuario = await User.create({ username, email, password });
  return { usuario, token: generarToken(usuario) };
}

async function login(email, password) {
  const usuario = await User.findOne({ email }).select("+password");
  if (!usuario) return null;

  const coincide = await usuario.comprobarPassword(password);
  if (!coincide) return null;

  return { usuario, token: generarToken(usuario) };
}

async function buscarPorId(id) {
  return User.findById(id);
}

module.exports = { registrar, login, buscarPorId };
