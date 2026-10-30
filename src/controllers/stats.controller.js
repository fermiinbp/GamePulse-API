const statsService = require("../services/stats.service");
const gamesService = require("../services/game.service");

// GET /games/:id/stats
async function historial(req, res) {
    const juego = await gamesService.buscarPorId(req.params.id);
    if (!juego) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    const stats = await statsService.historial(juego._id);
    res.json(stats.map((s) => s.resumen()));
}

// GET /games/trending
async function trending(req, res) {
    const limite = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);
    res.json(await statsService.trending(limite));
}

// POST /admin/sync
async function sincronizar(req, res) {
    res.json(await statsService.sincronizar());
}

module.exports = { historial, trending, sincronizar };