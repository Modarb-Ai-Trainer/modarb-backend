import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IWorkout {
    name: string;
    type: string;
    created_by: mongoose.Types.ObjectId;
    templateWeeks: [
        {
            days: [
                {
                    day: number,
                    exercises: [
                        {
                            exercise: mongoose.Types.ObjectId,
                        },
                    ],
                },
            ],
        },
    ]
}

const workoutSchema = new Schema({
    name: { type: String, required: true, unique: true, dropDups: true },
    type: { type: String, required: true },
    created_by: { type: mongoose.Types.ObjectId, ref: "users" },
    templateWeeks: [
        {
            days: [
                {
                    day: Number,
                    exercises: [
                        {
                            exercise: { type: mongoose.Types.ObjectId, ref: "exercises" },
                        },
                    ],
                },
            ],
        },
    ]
});


export type WorkoutDocument = IWorkout & mongoose.Document;

export const Workout = mongoose.model<WorkoutDocument>("workouts", workoutSchema);