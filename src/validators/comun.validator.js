const { param } = require("express-validator");

const idParam = [
  param("id").isMongoId().withMessage("El id no es válido"),
];

module.exports = { idParam };
