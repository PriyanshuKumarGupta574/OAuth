import mongoose, { Schema, Document } from "mongoose";

export interface ISnippet extends Document {
  title: string;
  code: string;
  language: string;
  tags: string[];
  visibility: "public" | "private";
  author: mongoose.Types.ObjectId;
  folder?: mongoose.Types.ObjectId
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
      enum: ["public", "private"],
      default: "private",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model<ISnippet>("Snippet", snippetSchema);
