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
  },
  {
    timestamps: true,
  },
);

gameListSchema.index({ owner: 1, name: 1 });

module.exports = mongoose.model("GameList", gameListSchema);
