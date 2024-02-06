import mongoose from "mongoose";
const { Schema } = mongoose;

const templateSchema = new Schema({
    name: { type: String, required: true, unique: true, dropDups: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    exercises: [{ type: mongoose.Types.ObjectId, ref: "exercises" }],
});



export const templateModel = mongoose.model("templates", templateSchema);
