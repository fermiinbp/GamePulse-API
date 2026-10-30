const { Router } = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const validarId = require("../middlewares/validarId");
const { listar, crear, actualizar, eliminar, estadisticas } = require("../controllers/review.controller");

const router = Router();

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Listar reseñas
 *     description: Devuelve las últimas 50 reseñas, con filtro opcional por videojuego.
 *     parameters:
 *       - in: query
 *         name: game
 *         schema:
 *           type: string
 *         description: Id del videojuego
 *     responses:
 *       200:
 *         description: Lista de reseñas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/", listar);

/**
 * @openapi
 * /api/reviews/stats:
 *   get:
 *     tags: [Reviews]
 *     summary: Contar reseñas positivas y negativas
 *     description: Positiva = nota 3 o más. Solo ANALYST o ADMIN.
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
 */
router.get("/stats", autenticar, autorizar("ANALYST", "ADMIN"), estadisticas);

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Crear una reseña
 *     description: Un usuario solo puede tener una reseña por videojuego. Solo USER o ADMIN.
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
 *         description: Datos no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermisos'
 *       404:
 *         description: Videojuego no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Ya tienes una reseña para este videojuego
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", autenticar, autorizar("USER", "ADMIN"), crear);

/**
 * @openapi
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Actualizar una reseña
 *     description: Solo el autor de la reseña o un ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la reseña
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
 *         description: Id o datos no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         description: No tienes permisos o no eres el autor de la reseña
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reseña no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", autenticar, autorizar("USER", "ADMIN"), validarId, actualizar);

/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Eliminar una reseña
 *     description: Solo el autor de la reseña o un ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la reseña
 *     responses:
 *       204:
 *         description: Reseña eliminada, sin contenido en la respuesta
 *       400:
 *         description: El id no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         description: No tienes permisos o no eres el autor de la reseña
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reseña no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", autenticar, autorizar("USER", "ADMIN"), validarId, eliminar);

module.exports = router;
