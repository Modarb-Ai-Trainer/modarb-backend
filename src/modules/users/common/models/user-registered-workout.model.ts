import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUserRegisteredWorkout {
    user: mongoose.Types.ObjectId,
    workout: mongoose.Types.ObjectId,
    isActive: Boolean,
    weeks: [
        {
            weekNumber: number,
            name: string,
            description: string,
            days: [
                {
                    dayNumber: number,
                    exercises: [mongoose.Types.ObjectId],
                    isDone: Boolean
                },
            ],
        },
    ]
}

const userRegisteredWorkoutSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    workout: { type: mongoose.Types.ObjectId, ref: "workouts" },
    isActive: { type: Boolean, default: false },
    weeks: [
        {
            days: [
                {
                    day: Number,
                    exercises: [
                        { type: mongoose.Types.ObjectId, ref: "exercises" },
                    ],
                    isDone: { type: Boolean, default: false }
                },
            ],
        },
    ]
});


export type UserRegisteredWorkoutDocument = IUserRegisteredWorkout & mongoose.Document;

export const UserRegisteredWorkout = mongoose.model<UserRegisteredWorkoutDocument>("UserRegisteredWorkouts", userRegisteredWorkoutSchema);