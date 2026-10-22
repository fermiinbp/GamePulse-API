const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
    steamAppId: { type: Number, required: [true, "El ID de Steam es obligatorio"], unique: true, min: 1 },
    name: { type: String, required: [true, "El nombre es obligatorio"], trim: true },
    shortDescription: { type: String, default: "" },
    genres: { type: [String], default: [] },
    developers: { type: [String], default: [] },
    publishers: { type: [String], default: [] },
    releaseDate: { type: Date },
    headerImage: { type: String, default: "" },
    isFree: { type: Boolean, default: false }
}, { timestamps: true });

class Game {

    resumen() {
        return {
            id: this.id,
            steamAppId: this.steamAppId,
            name: this.name,
            shortDescription: this.shortDescription,
            genres: this.genres,
            developers: this.developers,
            publishers: this.publishers,
            releaseDate: this.releaseDate,
            headerImage: this.headerImage,
            isFree: this.isFree
        };
    }

    esGenero(genero) {
        return this.genres.includes(genero);
    }
}

gameSchema.loadClass(Game);
gameSchema.index({ name: 1 });

gameSchema.set("toJSON", {
    versionKey: false,
    transform(doc, ret) {
        return {
            id: doc.id,
            steamAppId: ret.steamAppId,
            name: ret.name,
            shortDescription: ret.shortDescription,
            genres: ret.genres,
            developers: ret.developers,
            publishers: ret.publishers,
            releaseDate: ret.releaseDate,
            headerImage: ret.headerImage,
            isFree: ret.isFree,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt
        };
    }
});

module.exports = mongoose.model("Game", gameSchema);