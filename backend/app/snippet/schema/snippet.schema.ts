import mongoose, { Schema, Document } from "mongoose";

export interface ISnippet extends Document {
  title: string;
  code: string;
  language: string;
  tags: string[];
  visibility: "public" | "private" | "team";
  author: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
  folder?: mongoose.Types.ObjectId;
  views: number;
  forks: number;
  commentCount: number;
  lastViewedAt?: Date;
  trendingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const snippetSchema = new Schema<ISnippet>(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    tags: {
      type: [String],
      index: true,
      default: [],
    },

    visibility: {
      type: String,
      enum: ["public", "private", "team"],
      default: "private",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    lastViewedAt: {
      type: Date,
    },
    trendingScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISnippet>("Snippet", snippetSchema);
