const { Router } = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const validarCampos = require("../middlewares/validarCampos");
const { idParam } = require("../validators/comun.validator");
const gameValidator = require("../validators/game.validator");
const { historial, trending } = require("../controllers/stats.controller");
const { listar, generos, obtener, crear, actualizar, eliminar } = require("../controllers/game.controller");

const router = Router();

/**
 * @openapi
 * /games:
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
 *         schema: { type: string, maxLength: 100 }
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
 *       400:
 *         description: Algún parámetro de la query no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               limitFueraDeRango:
 *                 summary: limit mayor que 50
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "limit", mensaje: "limit debe ser un entero entre 1 y 50" }] }
 *               ordenNoValido:
 *                 summary: Campo de orden no permitido
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "orden", mensaje: "orden debe ser uno de: name, -name, releaseDate, -releaseDate" }] }
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/", gameValidator.listar, validarCampos, listar);

/**
 * @openapi
 * /games/genres:
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
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/genres", generos);

/**
 * @openapi
 * /games/trending:
 *   get:
 *     tags: [Games]
 *     summary: Videojuegos con más jugadores
 *     description: |
 *       Usa la última foto de estadísticas de cada juego y los ordena por jugadores.
 *       Si nunca se ha ejecutado `POST /admin/sync`, devuelve una lista vacía.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 20, default: 5 }
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
 *       400:
 *         description: limit no es un entero entre 1 y 20
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example: { error: "Los datos no son validos", detalles: [{ campo: "limit", mensaje: "limit debe ser un entero entre 1 y 20" }] }
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/trending", gameValidator.trending, validarCampos, trending);

/**
 * @openapi
 * /games/{id}/stats:
 *   get:
 *     tags: [Games]
 *     summary: Historial de estadísticas de un videojuego
 *     description: Devuelve las últimas 30 fotos (jugadores y precio), de la más reciente a la más antigua.
 *     parameters:
 *       - $ref: '#/components/parameters/GameId'
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
 *         $ref: '#/components/responses/IdNoValido'
 *       404:
 *         $ref: '#/components/responses/JuegoNoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/:id/stats", idParam, validarCampos, historial);

/**
 * @openapi
 * /games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Obtener un videojuego por id
 *     parameters:
 *       - $ref: '#/components/parameters/GameId'
 *     responses:
 *       200:
 *         description: Videojuego encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         $ref: '#/components/responses/IdNoValido'
 *       404:
 *         $ref: '#/components/responses/JuegoNoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.get("/:id", idParam, validarCampos, obtener);

/**
 * @openapi
 * /games:
 *   post:
 *     tags: [Games]
 *     summary: Crear un videojuego
 *     description: Solo `ADMIN`.
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
 *         description: Algún campo no es válido o el body no es un JSON válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               faltaNombre:
 *                 summary: No se ha enviado el nombre
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "name", mensaje: "El nombre es obligatorio" }] }
 *               steamAppIdNoValido:
 *                 summary: steamAppId no es un entero positivo
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "steamAppId", mensaje: "El steamAppId debe ser un entero mayor que 0" }] }
 *               bodyMal:
 *                 summary: JSON mal formado
 *                 value: { error: "El body está mal" }
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
 *             example: { error: "Valor repetido" }
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post("/", autenticar, autorizar("ADMIN"), gameValidator.crear, validarCampos, crear);

/**
 * @openapi
 * /games/{id}:
 *   patch:
 *     tags: [Games]
 *     summary: Actualizar un videojuego
 *     description: Se pueden mandar solo los campos que se quieran modificar. Solo `ADMIN` o `ANALYST`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/GameId'
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
 *         description: El id o algún campo no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               idNoValido:
 *                 summary: El id no es de MongoDB
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "id", mensaje: "El id no es válido" }] }
 *               fechaNoValida:
 *                 summary: Fecha con formato incorrecto
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "releaseDate", mensaje: "La fecha debe tener formato AAAA-MM-DD" }] }
 *               isFreeNoValido:
 *                 summary: isFree no es booleano
 *                 value: { error: "Los datos no son validos", detalles: [{ campo: "isFree", mensaje: "isFree debe ser true o false" }] }
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermisos'
 *       404:
 *         $ref: '#/components/responses/JuegoNoEncontrado'
 *       409:
 *         description: Ya existe otro videojuego con ese steamAppId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example: { error: "Valor repetido" }
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.patch("/:id", autenticar, autorizar("ADMIN", "ANALYST"), idParam, gameValidator.actualizar, validarCampos, actualizar);

/**
 * @openapi
 * /games/{id}:
 *   delete:
 *     tags: [Games]
 *     summary: Eliminar un videojuego
 *     description: Solo `ADMIN`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/GameId'
 *     responses:
 *       204:
 *         description: Videojuego eliminado, sin contenido en la respuesta
 *       400:
 *         $ref: '#/components/responses/IdNoValido'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermisos'
 *       404:
 *         $ref: '#/components/responses/JuegoNoEncontrado'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.delete("/:id", autenticar, autorizar("ADMIN"), idParam, validarCampos, eliminar);

module.exports = router;
