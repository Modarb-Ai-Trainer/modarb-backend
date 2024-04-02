import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IWorkout {
    name: string;
    description: string;
    type: string;
    created_by: mongoose.Types.ObjectId;
    image: object;
    templateWeeks: [
        {
            weekNumber: number;
            name: string,
            description: string,
            days: [
                {
                    dayNumber: number,
                    exercises: [mongoose.Types.ObjectId],
                },
            ],
        },
    ]
}

const workoutSchema = new Schema({
    name: { type: String, required: true, unique: true, dropDups: true },
    type: { type: String, required: true },
    created_by: { type: mongoose.Types.ObjectId, ref: "admins" },
    image: { type: Object },
    templateWeeks: [
        {
            days: [
                {
                    day: Number,
                    exercises: [
                        { type: mongoose.Types.ObjectId, ref: "exercises" },
                    ],
                },
            ],
        },
    ]
});


export type WorkoutDocument = IWorkout & mongoose.Document;

export const Workout = mongoose.model<WorkoutDocument>("workouts", workoutSchema);