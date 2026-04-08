// server/models/PlayerGame.js
const mongoose = require("mongoose");

const gameStatsSchema = new mongoose.Schema(
  {
    atBats: { type: Number, default: 0 },
    hits: { type: Number, default: 0 },
    singles: { type: Number, default: 0 },
    doubles: { type: Number, default: 0 },
    triples: { type: Number, default: 0 },
    homeRuns: { type: Number, default: 0 },
    rbi: { type: Number, default: 0 },
    walks: { type: Number, default: 0 },
    strikeOuts: { type: Number, default: 0 },
  },
  { _id: false }
);

const playerGameSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    team1: {
      type: String,
      default: "",
      trim: true,
    },
    team2: {
      type: String,
      default: "",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    stats: {
      type: gameStatsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

const PlayerGame = mongoose.model("PlayerGame", playerGameSchema);

module.exports = PlayerGame;