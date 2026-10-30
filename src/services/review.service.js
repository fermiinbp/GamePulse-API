const GameReview = require("../models/GameReview");

async function listar(gameId) {
    const filtro = gameId ? { gameId } : {};
    return GameReview.find(filtro)
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("userId", "username");
}

async function buscarPorId(id) {
    return GameReview.findById(id);
}

async function crear(datos) {
    return GameReview.create(datos);
}

async function actualizar(id, datos) {
    return GameReview.findByIdAndUpdate(id, datos, { returnDocument: "after", runValidators: true });
}

async function eliminar(id) {
    return GameReview.findByIdAndDelete(id);
}

async function estadisticas() {
    const positivas = await GameReview.countDocuments({ rating: { $gte: 3 } });
    const negativas = await GameReview.countDocuments({ rating: { $lt: 3 } });
    return { positivas, negativas };
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar, estadisticas };