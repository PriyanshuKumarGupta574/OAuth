import mongoose, { Schema, Document } from "mongoose";

export interface ISnippetVersion extends Document {
  snippet: mongoose.Types.ObjectId;
  title: string;
  code: string;
  language: string;
  tags: string[];
  visibility: "public" | "private";
  editedAt: Date;
}

const snippetVersionSchema = new Schema<ISnippetVersion>({
  snippet: { type: Schema.Types.ObjectId, ref: "Snippet" },
  title: String,
  code: String,
  language: String,
  tags: [String],
  visibility: String,
  editedAt: Date,
});

export default mongoose.model<ISnippetVersion>(
  "SnippetVersion",
  snippetVersionSchema
);


