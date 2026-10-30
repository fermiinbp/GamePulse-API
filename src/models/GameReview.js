const mongoose = require("mongoose");

const gameReviewSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "El usuario es obligatorio"] },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: [true, "El juego es obligatorio"] },
    rating: {
        type: Number,
        required: [true, "La nota es obligatoria"],
        min: [1, "La nota mínima es 1"],
        max: [5, "La nota máxima es 5"],
        validate: { validator: Number.isInteger, message: "La nota debe ser un número entero" }
    },
    comment: { type: String, trim: true, maxlength: [500, "El comentario no puede pasar de 500 caracteres"], default: "" }
}, { timestamps: true });

// Una reseña por usuario y juego
gameReviewSchema.index({ userId: 1, gameId: 1 }, { unique: true });

class GameReview {

    resumen() {
        return {
            id: this.id,
            userId: this.userId?._id,
            username: this.userId?.username,
            gameId: this.gameId,
            rating: this.rating,
            comment: this.comment,
            createdAt: this.createdAt
        };
    }
}

gameReviewSchema.loadClass(GameReview);

module.exports = mongoose.model("GameReview", gameReviewSchema, "game_reviews");