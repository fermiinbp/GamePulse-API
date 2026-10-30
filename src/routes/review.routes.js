const { Router } = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const validarCampos = require("../middlewares/validarCampos");
const { idParam } = require("../validators/comun.validator");
const reviewValidator = require("../validators/review.validator");
const { listar, crear, actualizar, eliminar, estadisticas } = require("../controllers/review.controller");

const router = Router();

/**
 * @openapi
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Listar reseñas
 *     description: Devuelve las últimas 50 reseñas, con filtro opcional por videojuego.
 *     parameters:
 *       - in: query
 *         name: game
 *         schema: { type: string }
 *         description: Id del videojuego en MongoDB
 *         example: 665f1c2e9b1e8a0012a3b4c5
 *     responses:
 *       200:
 *         description: Lista de reseñas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       400:
 *         description: El id del videojuego no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example: { error: "Los datos no son validos", detalles: [{ campo: "game", mensaje: "El id del videojuego no es válido" }] }
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/", reviewValidator.listar, validarCampos, listar);

/**
 * @openapi
 * /reviews/stats:
 *   get:
 *     tags: [Reviews]
 *     summary: Contar reseñas positivas y negativas
 *     description: Positiva = nota 3 o más. Solo `ANALYST` o `ADMIN`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recuento de reseñas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewStats'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermisos'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/stats", autenticar, autorizar("ANALYST", "ADMIN"), estadisticas);

/**
 * @openapi
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Crear una reseña
 *     description: Un usuario solo puede tener una reseña por videojuego. Solo `USER` o `ADMIN`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Reseña creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Algún campo no es válido o el body no es un JSON válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               notaFueraDeRango:
 *                 summary: Nota que no está entre 1 y 5
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "rating", mensaje: "La nota debe ser un número entero del 1 al 5" }] }
 *               gameIdNoValido:
 *                 summary: gameId que no es un id de MongoDB
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "gameId", mensaje: "El gameId no es válido" }] }
 *               comentarioLargo:
 *                 summary: Comentario de más de 500 caracteres
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "comment", mensaje: "El comentario no puede pasar de 500 caracteres" }] }
 *               bodyMal:
 *                 summary: JSON mal formado
 *                 value: { error: "El body está mal" }
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermisos'
 *       404:
 *         $ref: '#/components/responses/JuegoNoEncontrado'
 *       409:
 *         description: Ya tienes una reseña para este videojuego
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example: { error: "Valor repetido" }
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post("/", autenticar, autorizar("USER", "ADMIN"), reviewValidator.crear, validarCampos, crear);

/**
 * @openapi
 * /reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Actualizar una reseña
 *     description: Solo el autor de la reseña o un `ADMIN`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ReviewId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewUpdate'
 *     responses:
 *       200:
 *         description: Reseña actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: El id o algún campo no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               idNoValido:
 *                 summary: El id no es de MongoDB
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "id", mensaje: "El id no es válido" }] }
 *               notaFueraDeRango:
 *                 summary: Nota que no está entre 1 y 5
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "rating", mensaje: "La nota debe ser un número entero del 1 al 5" }] }
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         description: Tu rol no tiene acceso o no eres el autor de la reseña
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               sinPermisos:
 *                 summary: Rol sin acceso (ANALYST)
 *                 value: { error: "No tienes permisos" }
 *               noEsElAutor:
 *                 summary: La reseña es de otro usuario
 *                 value: { error: "No puedes modificar esta reseña" }
 *       404:
 *         $ref: '#/components/responses/ReviewNoEncontrada'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.put("/:id", autenticar, autorizar("USER", "ADMIN"), idParam, reviewValidator.actualizar, validarCampos, actualizar);

/**
 * @openapi
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Eliminar una reseña
 *     description: Solo el autor de la reseña o un `ADMIN`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ReviewId'
 *     responses:
 *       204:
 *         description: Reseña eliminada, sin contenido en la respuesta
 *       400:
 *         $ref: '#/components/responses/IdNoValido'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         description: Tu rol no tiene acceso o no eres el autor de la reseña
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               sinPermisos:
 *                 summary: Rol sin acceso (ANALYST)
 *                 value: { error: "No tienes permisos" }
 *               noEsElAutor:
 *                 summary: La reseña es de otro usuario
 *                 value: { error: "No puedes eliminar esta reseña" }
 *       404:
 *         $ref: '#/components/responses/ReviewNoEncontrada'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.delete("/:id", autenticar, autorizar("USER", "ADMIN"), idParam, validarCampos, eliminar);

module.exports = router;
