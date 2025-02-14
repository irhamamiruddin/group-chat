import mongoose, { Schema, Document } from "mongoose";

interface IGroup extends Document {
    name: string;
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

export const Group = mongoose.model<IGroup>("groups", GroupSchema);