import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    snippet: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    text: string;
    parentComment?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        snippet: {
            type: Schema.Types.ObjectId,
            ref: "Snippet",
            required: true,
            index: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
            index: true,
        },
    },
    { timestamps: true }
);


commentSchema.index({ snippet: 1, createdAt: 1 });

commentSchema.index({ parentComment: 1, createdAt: 1 });

export default mongoose.model<IComment>("Comment", commentSchema);
