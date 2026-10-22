const userService = require("../services/user.service");

async function listar(req, res) {
  const user = await userService.listar(req.query);
  res.status(200).json(user.map((p) => p.resumen()));
}

async function obtener(req, res) {
  const user = await userService.listar();
  if (!user) {
    return res.status(404).json({ error: "No encontrado" });
  }
  res.json(user);
}

//CRUD
//POST

//PUT

//DELETE

module.exports = { listar, obtener };
