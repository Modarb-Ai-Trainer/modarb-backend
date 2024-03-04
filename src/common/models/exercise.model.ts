import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IExercise {
    name: string;
}

const exerciseSchema = new Schema({
    name: { type: String, required: true, unique: true, dropDups: true },

});

export type ExerciseDocument = IExercise & mongoose.Document;

export const Exercise = mongoose.model<ExerciseDocument>("exercises", exerciseSchema);

