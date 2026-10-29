const mongoose = require("mongoose");

const gameListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la lista es obligatorio"],
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    games: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

gameListSchema.index({ owner: 1, name: 1 });

gameListSchema.methods.resumen = function () {
  return {
    _id: this._id,
    name: this.name,
    owner: this.owner,
    games: this.games,
    isPublic: this.isPublic,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("GameList", gameListSchema);
