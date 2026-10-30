const { param } = require("express-validator");

// :id de la URL debe ser un id de MongoDB
const idParam = [
  param("id").isMongoId().withMessage("El id no es válido"),
];

module.exports = { idParam };
