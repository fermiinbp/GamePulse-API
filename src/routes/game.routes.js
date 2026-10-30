const { Router } = require("express");
const validarId = require("../middlewares/validarId");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const { historial, trending } = require("../controllers/stats.controller");
const { listar, generos, obtener, crear, actualizar, eliminar } = require("../controllers/game.controller");

const router = Router();

/**
 * @openapi
 * /api/games:
 *   get:
 *     tags: [Games]
 *     summary: Listar videojuegos con paginación y filtros
 *     description: Todos los filtros son opcionales y se pueden combinar.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50, default: 10 }
 *         description: Videojuegos por página
 *       - in: query
 *         name: genero
 *         schema: { type: string }
 *         description: Filtra por género exacto
 *         example: RPG
 *       - in: query
 *         name: buscar
 *         schema: { type: string }
 *         description: Busca por nombre (no distingue mayúsculas)
 *         example: elden
 *       - in: query
 *         name: gratis
 *         schema: { type: string, enum: ["true", "false"] }
 *         description: Solo gratuitos (true) o solo de pago (false)
 *       - in: query
 *         name: desarrollador
 *         schema: { type: string }
 *         description: Filtra por desarrolladora exacta
 *         example: FromSoftware
 *       - in: query
 *         name: orden
 *         schema: { type: string, enum: [name, -name, releaseDate, -releaseDate], default: name }
 *         description: Campo de orden; con "-" delante es descendente
 *     responses:
 *       200:
 *         description: Página de videojuegos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamePage'
 */
router.get("/", listar);

/**
 * @openapi
 * /api/games/genres:
 *   get:
 *     tags: [Games]
 *     summary: Listar todos los géneros disponibles
 *     description: Útil para rellenar el desplegable de filtros del front.
 *     responses:
 *       200:
 *         description: Géneros ordenados alfabéticamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { type: string }
 *               example: ["Action", "Adventure", "RPG"]
 */
router.get("/genres", generos);

/**
 * @openapi
 * /api/games/trending:
 *   get:
 *     tags: [Games]
 *     summary: Videojuegos con más jugadores ahora mismo
 *     description: Usa la última foto de estadísticas de cada juego y los ordena por jugadores.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 5
 *         description: Número de videojuegos a devolver
 *     responses:
 *       200:
 *         description: Ranking de videojuegos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trending'
 */
router.get("/trending", trending);

/**
 * @openapi
 * /api/games/{id}/stats:
 *   get:
 *     tags: [Games]
 *     summary: Historial de estadísticas de un videojuego
 *     description: Devuelve las últimas 30 fotos (jugadores y precio), de la más reciente a la más antigua.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del videojuego en MongoDB
 *     responses:
 *       200:
 *         description: Historial de estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameStat'
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
 *     description: Solo ADMIN.
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermisos'
 *       409:
 *         description: Ya existe un videojuego con ese steamAppId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", autenticar, autorizar("ADMIN"), crear);

/**
 * @openapi
 * /api/games/{id}:
 *   patch:
 *     tags: [Games]
 *     summary: Actualizar un videojuego
 *     description: Se pueden mandar solo los campos que se quieran modificar. Solo ADMIN o ANALYST.
 *     security:
 *       - bearerAuth: []
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
 */
router.patch("/:id", autenticar, autorizar("ADMIN", "ANALYST"), validarId, actualizar);

/**
 * @openapi
 * /api/games/{id}:
 *   delete:
 *     tags: [Games]
 *     summary: Eliminar un videojuego
 *     description: Solo ADMIN.
 *     security:
 *       - bearerAuth: []
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
 */
router.delete("/:id", autenticar, autorizar("ADMIN"), validarId, eliminar);

module.exports = router;