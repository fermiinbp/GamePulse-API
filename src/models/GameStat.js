const mongoose = require("mongoose");

const gameStatSchema = mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: [true, "El juego es obligatorio"] },
    recordedAt: { type: Date, default: Date.now },
    currentPlayers: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    currency: { type: String, default: "EUR" }
});

gameStatSchema.index({ gameId: 1, recordedAt: -1 });

class GameStat {

    resumen() {
        return {
            id: this.id,
            gameId: this.gameId,
            recordedAt: this.recordedAt,
            currentPlayers: this.currentPlayers,
            price: this.price,
            discountPercent: this.discountPercent,
            currency: this.currency
        };
    }
}

gameStatSchema.loadClass(GameStat);

module.exports = mongoose.model("GameStat", gameStatSchema, "game_stats");