import mongoose, { Schema, Document } from "mongoose";

export interface ITeam {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    members: {
        user: mongoose.Types.ObjectId;
        role: "editor" | "viewer";
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        members: [
            {
                _id: false,
                user: { type: Schema.Types.ObjectId, ref: "User", required: true },
                role: {
                    type: String,
                    enum: ["editor", "viewer"],
                    default: "viewer",
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<ITeam>("Team", TeamSchema);
