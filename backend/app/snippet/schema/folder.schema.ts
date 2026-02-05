import mongoose, { Schema, Document } from "mongoose";

export interface IFolder extends Document {
  name: string;
  user: mongoose.Types.ObjectId;
}

const folderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFolder>("Folder", folderSchema);


// import mongoose, { Schema } from "mongoose";

// const folderSchema = new Schema({
//   name: String,
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },
// });

// export default mongoose.model("Folder", folderSchema);


