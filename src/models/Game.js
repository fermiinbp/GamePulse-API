const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    steamAppId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String },
    genres: [String],
    developers: [String],
    publishers: [String],
    releaseDate: { type: Date },
    headerImage: { type: String },
    isFree: { type: Boolean, default: false },
  },
  { timestamps: true }
);

gameSchema.index({ name: 1 });

module.exports = mongoose.model('Game', gameSchema);