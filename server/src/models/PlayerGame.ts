import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IGameStats {
  atBats?: number;
  hits?: number;
  singles?: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
  rbi?: number;
  walks?: number;
  strikeOuts?: number;
}

export interface IPlayerGame extends Document {
  playerId: Types.ObjectId;
  team1: string;
  team2: string;
  date: Date;
  stats: IGameStats;
}

const gameStatsSchema: Schema<IGameStats> = new Schema(
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

const playerGameSchema: Schema<IPlayerGame> = new Schema(
  {
    playerId: {
      type: Schema.Types.ObjectId,
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

const PlayerGame: Model<IPlayerGame> = mongoose.model<IPlayerGame>(
  "PlayerGame",
  playerGameSchema
);

export default PlayerGame;