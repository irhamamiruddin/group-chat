import mongoose, { Schema, Document } from "mongoose";

interface IMessage extends Document {
    groupId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>("messages", MessageSchema);