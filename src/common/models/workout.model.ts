import mongoose from "mongoose";
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { FitnessLevel } from "@common/enums/fitness-level.enum";
import { Place } from "@common/enums/place.enum";

const { Schema } = mongoose;

export interface IWorkout {
    name: string;
    description: string;
    type: string;
    created_by: mongoose.Types.ObjectId;
    image: string;
    fitness_level: FitnessLevel;
    fitness_goal: FitnessGoal;
    place: [Place];
    min_per_day: number;
    total_number_days: number;
    template_weeks: [
        {
            week_number: number;
            week_name: string,
            week_description: string,
            days: [
                {
                    day_number: number,
                    total_number_exercises: number,
                    day_type: string,
                    exercises: [mongoose.Types.ObjectId],
                },
            ],
        },
    ],
    aiGenerated: boolean;
}

const workoutSchema = new Schema({
    name: { type: String, required: true, unique: true, dropDups: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    created_by: { type: mongoose.Types.ObjectId, ref: "admins" },
    image: { type: String },
    fitness_level: { type: String, enum: FitnessLevel, required: true, },
    fitness_goal: { type: String, enum: FitnessGoal, required: true, },
    place: [{ type: String, enum: Place, required: true, }],
    min_per_day: { type: Number, required: true, },
    total_number_days: { type: Number, required: true, },
    template_weeks: [
        {
            week_number: { type: Number, required: true, },
            week_name: { type: String, required: true, },
            week_description: { type: String, required: true, },
            days: [
                {
                    day_number: { type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7] },
                    total_number_exercises: { type: Number, required: true, },
                    day_type: { type: String, required: true, },
                    exercises: [
                        { type: mongoose.Types.ObjectId, ref: "exercises" },
                    ],
                },
            ],
        },
    ],
    aiGenerated: { type: Boolean, required: true, default: false },
});


export type WorkoutDocument = IWorkout & mongoose.Document;

export const Workout = mongoose.model<WorkoutDocument>("workouts", workoutSchema);
