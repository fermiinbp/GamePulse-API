const { body, query } = require("express-validator");

const ORDENES = ["name", "-name", "releaseDate", "-releaseDate"];

// Reglas de los campos de un videojuego.
// "obligatorio" indica si steamAppId y name deben venir (crear) o no (actualizar).
function camposJuego(obligatorio) {
  const steamAppId = body("steamAppId");
  const name = body("name");
  if (!obligatorio) {
    steamAppId.optional();
    name.optional();
  }

  return [
    steamAppId
      .isInt({ min: 1 }).withMessage("El steamAppId debe ser un entero mayor que 0")
      .toInt(),
    name
      .isString().withMessage("El nombre es obligatorio")
      .trim()
      .notEmpty().withMessage("El nombre es obligatorio"),
    body("shortDescription")
      .optional()
      .isString().withMessage("La descripción debe ser texto")
      .trim(),
    body(["genres", "developers", "publishers"])
      .optional()
      .isArray().withMessage("Debe ser una lista de textos"),
    body(["genres.*", "developers.*", "publishers.*"])
      .isString().withMessage("Cada elemento debe ser texto")
      .trim(),
    body("releaseDate")
      .optional()
      .isISO8601().withMessage("La fecha debe tener formato AAAA-MM-DD")
      .toDate(),
    body("headerImage")
      .optional({ values: "falsy" })
      .isURL().withMessage("La imagen debe ser una URL"),
    body("isFree")
      .optional()
      .isBoolean({ strict: true }).withMessage("isFree debe ser true o false"),
  ];
}

const crear = camposJuego(true);
const actualizar = camposJuego(false);

// Query de GET /api/games
const listar = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("page debe ser un entero mayor que 0"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage("limit debe ser un entero entre 1 y 50"),
  query(["genero", "desarrollador"])
    .optional()
    .isString()
    .trim(),
  query("buscar")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 }).withMessage("La búsqueda no puede pasar de 100 caracteres"),
  query("gratis")
    .optional()
    .isIn(["true", "false"]).withMessage("gratis debe ser true o false"),
  query("orden")
    .optional()
    .isIn(ORDENES).withMessage(`orden debe ser uno de: ${ORDENES.join(", ")}`),
];

// Query de GET /api/games/trending
const trending = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage("limit debe ser un entero entre 1 y 20"),
];

module.exports = { crear, actualizar, listar, trending };
