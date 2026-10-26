const { Router } = require("express");
const validarId = require("../middlewares/validarId");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const { historial, trending } = require("../controllers/stats.controller");
const { listar, obtener, crear, actualizar, eliminar } = require("../controllers/game.controller");

const router = Router();

/**
 * @openapi
 * /api/games:
 *   get:
 *     tags: [Games]
 *     summary: Listar videojuegos
 *     description: Devuelve hasta 20 videojuegos ordenados por nombre, con filtro opcional por género.
 *     parameters:
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: Filtra por género
 *         example: RPG
 *     responses:
 *       200:
 *         description: Lista de videojuegos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
router.get("/", listar);

router.get("/trending", trending);


router.get("/:id/stats", validarId, historial);

/**
 * @openapi
 * /api/games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Obtener un videojuego por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del videojuego en MongoDB
 *     responses:
 *       200:
 *         description: Videojuego encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: El id no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Videojuego no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validarId, obtener);

/**
 * @openapi
 * /api/games:
 *   post:
 *     tags: [Games]
 *     summary: Crear un videojuego
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       201:
 *         description: Videojuego creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Datos no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Ya existe un videojuego con ese steamAppId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", autenticar, autorizar("admin"), crear);

/**
 * @openapi
 * /api/games/{id}:
 *   patch:
 *     tags: [Games]
 *     summary: Actualizar un videojuego
 *     description: Se pueden mandar solo los campos que se quieran modificar.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del videojuego en MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameUpdate'
 *     responses:
 *       200:
 *         description: Videojuego actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Id o datos no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Videojuego no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id", autenticar, autorizar("admin", "analista"), validarId, actualizar);

/**
 * @openapi
 * /api/games/{id}:
 *   delete:
 *     tags: [Games]
 *     summary: Eliminar un videojuego
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del videojuego en MongoDB
 *     responses:
 *       204:
 *         description: Videojuego eliminado, sin contenido en la respuesta
 *       400:
 *         description: El id no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Videojuego no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", autenticar, autorizar("admin"), validarId, eliminar);

module.exports = router;