const { body } = require("express-validator");

const registro = [
  body("username")
    .isString().withMessage("El username es obligatorio")
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage("El username debe tener entre 3 y 30 caracteres"),
  body("email")
    .isString().withMessage("El email es obligatorio")
    .trim()
    .toLowerCase()
    .isEmail().withMessage("El email no es válido"),
  body("password")
    .isString().withMessage("La contraseña es obligatoria")
    .isLength({ min: 6, max: 20 }).withMessage("La contraseña debe tener entre 6 y 20 caracteres"),
];

const login = [
  body("email")
    .isString().withMessage("El email es obligatorio")
    .trim()
    .toLowerCase()
    .isEmail().withMessage("El email no es válido"),
  body("password")
    .isString().withMessage("La contraseña es obligatoria")
    .notEmpty().withMessage("La contraseña es obligatoria"),
];

module.exports = { registro, login };
