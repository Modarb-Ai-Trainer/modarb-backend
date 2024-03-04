import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IWorkout {
    name: string;
}

const workoutSchema = new Schema({
    name: { type: String, required: true, unique: true, dropDups: true },
});


export type WorkoutDocument = IWorkout & mongoose.Document;

export const Workout = mongoose.model<WorkoutDocument>("workouts", workoutSchema);
