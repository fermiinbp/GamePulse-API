const gamesService = require("../services/game.service")

async function listar(req, res) {
    const games = await gamesService.listar(req.query.genero);
    res.json(games.map(g => g.resumen()));
}

async function obtener(req, res) {
    const game = await gamesService.buscarPorId(req.params.id);

    if (!game) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.json(game.resumen());
}

async function crear(req, res) {
    const game = await gamesService.crear(req.body);
    res.status(201).json(game.resumen());
}

async function actualizar(req, res) {
    const game = await gamesService.actualizar(req.params.id, req.body);

    if (!game) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.json(game.resumen());
}

async function eliminar(req, res) {
    const game = await gamesService.eliminar(req.params.id);

    if (!game) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.status(204).end();
}

module.exports = {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar
};