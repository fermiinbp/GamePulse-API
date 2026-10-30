const { Router } = require("express");
const {
  listar,
  listarMias,
  buscarPorId,
  crearGameList,
  actualizar,
  eliminar,
  actualizarOwners,
  addGame,
} = require("../controllers/gamelist.controller");
const validarGameId = require("../middlewares/validarGameId");
const { eliminarJuego } = require("../controllers/gamelist.controller");
const router = Router();
const autenticar = require("../middlewares/autenticar");
const validarId = require("../middlewares/validarId");
const autorizarGameList = require("../middlewares/autorizarGameList");
const autenticarOpcional = require("../middlewares/autorizarOpcional");
const autorizarPropietarioGameList = require("../middlewares/autorizarPropietarioGameList");

/**
 * @swagger
 * tags:
 *   name: GameList
 *   description: Gestión de listas de videojuegos
 */

/**
 * @swagger
 * /gamelist:
 *   get:
 *     summary: Obtener listas de videojuegos
 *     tags: [GameList]
 *     responses:
 *       200:
 *         description: Listas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameList'
 */
router.get("/", listar);

/**
 * @swagger
 * /gamelist/mine:
 *   get:
 *     summary: Obtener las listas del usuario autenticado
 *     tags: [GameList]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listas del usuario obtenidas correctamente
 *       401:
 *         description: No autenticado o token inválido
 */
router.get("/mine", autenticar, listarMias);

/**
 * @swagger
 * /gamelist/{id}:
 *   get:
 *     summary: Obtener una lista por su ID
 *     tags: [GameList]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la lista
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     responses:
 *       200:
 *         description: Lista encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameList'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Se requiere autenticación para consultar una lista privada
 *       403:
 *         description: No tienes permisos para consultar esta lista
 *       404:
 *         description: Lista no encontrada
 */
router.get(
  "/:id",
  validarId,
  autenticarOpcional,
  autorizarGameList,
  buscarPorId,
);

/**
 * @swagger
 * /gamelist:
 *   post:
 *     summary: Crear una lista de videojuegos
 *     tags: [GameList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameListInput'
 *     responses:
 *       201:
 *         description: Lista creada correctamente
 *       400:
 *         description: Datos incorrectos
 *       401:
 *         description: No autenticado o token inválido
 */
router.post("/", autenticar, crearGameList);

/**
 * @swagger
 * /gamelist/{id}/games:
 *   post:
 *     summary: Añadir un videojuego a una lista
 *     tags: [GameList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameListAddGame'
 *     responses:
 *       200:
 *         description: Juego añadido correctamente
 *       400:
 *         description: ID de juego inválido o juego inexistente
 *       401:
 *         description: No autenticado o token inválido
 *       403:
 *         description: No tienes permisos para modificar esta lista
 *       404:
 *         description: Lista no encontrada
 *       409:
 *         description: El juego ya está en la lista
 */
router.post(
  "/:id/games",
  autenticar,
  validarId,
  autorizarPropietarioGameList,
  addGame,
);

/**
 * @swagger
 * /gamelist/{id}:
 *   patch:
 *     summary: Actualizar una lista de videojuegos
 *     tags: [GameList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameListUpdate'
 *     responses:
 *       200:
 *         description: Lista actualizada correctamente
 *       400:
 *         description: Datos incorrectos
 *       401:
 *         description: No autenticado o token inválido
 *       403:
 *         description: No tienes permisos para modificar esta lista
 *       404:
 *         description: Lista no encontrada
 */
router.patch(
  "/:id",
  autenticar,
  validarId,
  autorizarPropietarioGameList,
  actualizar,
);

/**
 * @swagger
 * /gamelist/{id}/owners:
 *   patch:
 *     summary: Actualizar los propietarios de una lista
 *     tags: [GameList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameListUpdateOwners'
 *     responses:
 *       200:
 *         description: Propietarios actualizados correctamente
 *       400:
 *         description: Datos incorrectos o usuarios inexistentes
 *       401:
 *         description: No autenticado o token inválido
 *       403:
 *         description: No tienes permisos para modificar los propietarios
 *       404:
 *         description: Lista no encontrada
 */
router.patch(
  "/:id/owners",
  autenticar,
  validarId,
  autorizarPropietarioGameList,
  actualizarOwners,
);

/**
 * @swagger
 * /gamelist/{id}:
 *   delete:
 *     summary: Eliminar una lista de videojuegos
 *     tags: [GameList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la lista
 *     responses:
 *       200:
 *         description: Lista eliminada correctamente
 *       401:
 *         description: No autenticado o token inválido
 *       403:
 *         description: No tienes permisos para eliminar esta lista
 *       404:
 *         description: Lista no encontrada
 */
router.delete(
  "/:id",
  autenticar,
  validarId,
  autorizarPropietarioGameList,
  eliminar,
);

/**
 * @swagger
 * /gamelist/{id}/games/{gameId}:
 *   delete:
 *     summary: Eliminar un videojuego de una lista
 *     tags: [GameList]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la lista
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del videojuego
 *     responses:
 *       200:
 *         description: Juego eliminado correctamente
 *       400:
 *         description: Alguno de los identificadores es inválido
 *       401:
 *         description: No autenticado o token inválido
 *       403:
 *         description: No tienes permisos para modificar esta lista
 *       404:
 *         description: Lista o juego no encontrado en ella
 */
router.delete(
  "/:id/games/:gameId",
  autenticar,
  validarId,
  validarGameId,
  autorizarPropietarioGameList,
  eliminarJuego,
);

module.exports = router;
