const reviewService = require("../services/review.service");
const gamesService = require("../services/game.service");

function puedeTocar(review, usuario) {
    return review.userId.toString() === usuario.id || usuario.role === "ADMIN";
}

// GET /review 
async function listar(req, res) {
    const reviews = await reviewService.listar(req.query.game);
    res.json(reviews.map(r => r.resumen()));
}

// POST /review
async function crear(req, res) {
    const { gameId, rating, comment } = req.body;

    const juego = await gamesService.buscarPorId(gameId);
    if (!juego) {
        return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    const review = await reviewService.crear({
        userId: req.usuario.id,
        gameId: juego._id,
        rating,
        comment
    });

    res.status(201).json(review.resumen());
}

// PUT /review/:id
async function actualizar(req, res) {
    const review = await reviewService.buscarPorId(req.params.id);
    if (!review) {
        return res.status(404).json({ error: "Reseña no encontrada" });
    }
    if (!puedeTocar(review, req.usuario)) {
        return res.status(403).json({ error: "No puedes modificar esta reseña" });
    }

    const { rating, comment } = req.body;
    const actualizada = await reviewService.actualizar(req.params.id, { rating, comment });

    res.json(actualizada.resumen());
}

// DELETE /review/:id
async function eliminar(req, res) {
    const review = await reviewService.buscarPorId(req.params.id);
    if (!review) {
        return res.status(404).json({ error: "Reseña no encontrada" });
    }
    if (!puedeTocar(review, req.usuario)) {
        return res.status(403).json({ error: "No puedes eliminar esta reseña" });
    }

    await reviewService.eliminar(req.params.id);
    res.status(204).end();
}

// GET /review/stats
async function estadisticas(req, res) {
    res.json(await reviewService.estadisticas());
}

module.exports = { listar, crear, actualizar, eliminar, estadisticas };