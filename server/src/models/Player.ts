import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  number?: number | null;
  position?: string;
  image?: string;
}

const playerSchema: Schema<IPlayer> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: Number,
      default: null,
    },
    position: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Player: Model<IPlayer> = mongoose.model<IPlayer>(
  "Player",
  playerSchema
);

export default Player;