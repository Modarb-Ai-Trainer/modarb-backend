import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUserRegisteredWorkout {
    user: mongoose.Types.ObjectId,
    workout: mongoose.Types.ObjectId,
    is_active: Boolean,
    weeks: [
        {
            week_number: number,
            week_name: string,
            week_description: string,
            is_done: boolean,
            days: [
                {
                    day_number: number,
                    total_number_exercises: number,
                    day_type: string,
                    exercises: [mongoose.Types.ObjectId],
                    is_done: boolean
                },
            ],
        },
    ]
}

const userRegisteredWorkoutSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    workout: { type: mongoose.Types.ObjectId, ref: "workouts" },
    is_active: { type: Boolean, default: false },
    weeks: [
        {
            week_number: { type: Number },
            week_name: { type: String, required: true, },
            week_description: { type: String, required: true, },
            is_done: { type: Boolean, default: false },
            days: [
                {
                    day_number: { type: Number, required: true, },
                    total_number_exercises: { type: Number, required: true, },
                    day_type: { type: String, required: true, },
                    exercises: [
                        { type: mongoose.Types.ObjectId, ref: "exercises" },
                    ],
                    is_done: { type: Boolean, default: false }
                },
            ],
        },
    ]
});


export type UserRegisteredWorkoutDocument = IUserRegisteredWorkout & mongoose.Document;

export const UserRegisteredWorkout = mongoose.model<UserRegisteredWorkoutDocument>("UserRegisteredWorkouts", userRegisteredWorkoutSchema);