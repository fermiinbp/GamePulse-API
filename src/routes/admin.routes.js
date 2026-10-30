const { Router } = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const { sincronizar } = require("../controllers/stats.controller");

const router = Router();

/**
 * @openapi
 * /api/admin/sync:
 *   post:
 *     tags: [Admin]
 *     summary: Sincronizar estadísticas con Steam
 *     description: |
 *       Pide a Steam los jugadores conectados y el precio de cada videojuego y guarda una foto en `game_stats`.
 *       Si falla un juego, se apunta en `errores` y se sigue con los demás. Solo `ADMIN`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultado de la sincronización
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResult'
 *       401:
 *         $ref: '#/components/responses/NoAutenticado'
 *       403:
 *         $ref: '#/components/responses/SinPermisos'
 *       500:
 *         $ref: '#/components/responses/ErrorServidor'
 */
router.post("/sync", autenticar, autorizar("ADMIN"), sincronizar);

module.exports = router;
