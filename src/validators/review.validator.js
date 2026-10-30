const { body, query } = require("express-validator");

const rating = () => body("rating")
  .isInt({ min: 1, max: 5 }).withMessage("La nota debe ser un número entero del 1 al 5")
  .toInt();

const comment = () => body("comment")
  .optional()
  .isString().withMessage("El comentario debe ser texto")
  .trim()
  .isLength({ max: 500 }).withMessage("El comentario no puede pasar de 500 caracteres");

const crear = [
  body("gameId")
    .isMongoId().withMessage("El gameId no es válido"),
  rating(),
  comment(),
];

const actualizar = [
  rating().optional(),
  comment(),
];

// Query de GET /api/reviews
const listar = [
  query("game")
    .optional()
    .isMongoId().withMessage("El id del videojuego no es válido"),
];

module.exports = { crear, actualizar, listar };
