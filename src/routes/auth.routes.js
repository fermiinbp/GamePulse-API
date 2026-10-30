const express = require("express");
const { registro, login, perfil } = require("../controllers/auth.controller");
const autenticar = require("../middlewares/autenticar");
const validarCampos = require("../middlewares/validarCampos");
const authValidator = require("../validators/auth.validator");

const router = express.Router();

/**
 * @openapi
 * /auth/registro:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un usuario nuevo
 *     description: Todos los usuarios nuevos se crean con rol `USER`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroInput'
 *     responses:
 *       201:
 *         description: Usuario creado, devuelve el usuario y su token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Algún campo no es válido o el body no es un JSON válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               emailNoValido:
 *                 summary: Email con formato incorrecto
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "email", mensaje: "El email no es válido" }] }
 *               passwordCorta:
 *                 summary: Contraseña demasiado corta
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "password", mensaje: "La contraseña debe tener entre 6 y 20 caracteres" }] }
 *               bodyMal:
 *                 summary: JSON mal formado
 *                 value: { error: "El body está mal" }
 *       409:
 *         description: Ya existe un usuario con ese email o username
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example: { error: "Valor repetido" }
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post("/registro", authValidator.registro, validarCampos, registro);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login correcto, devuelve el usuario y su token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Falta el email o la contraseña, o el email no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               faltaPassword:
 *                 summary: No se ha enviado la contraseña
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "password", mensaje: "La contraseña es obligatoria" }] }
 *               emailNoValido:
 *                 summary: Email con formato incorrecto
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "email", mensaje: "El email no es válido" }] }
 *       401:
 *         $ref: '#/components/responses/CredencialesIncorrectas'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post("/login", authValidator.login, validarCampos, login);

/**
 * @openapi
 * /auth/perfil:
 *   get:
 *     tags: [Auth]
 *     summary: Ver el perfil del usuario logueado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       404:
 *         $ref: '#/components/responses/UsuarioNoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/perfil", autenticar, perfil);

module.exports = router;
