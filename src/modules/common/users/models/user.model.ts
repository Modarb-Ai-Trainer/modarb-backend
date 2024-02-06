import mongoose from "mongoose";
import bcrypt from "bcrypt";
export const saltrounds = 5;
import { Role, Gender, FitnessLevel, FitnessGoal, WorkoutPlace, PreferredDay, PreferredEquipment, Injury } from "../enums/roles.enum";
const { Schema } = mongoose;

export interface IUser {
    name: string;
    email: string;
    password: string;
    image: object;
    role: Role;
    gender: string;
    dob: Date;
    height: number;
    weight: number;
    fitness_level: string;
    preferences: {
        fitness_goal: FitnessGoal;
        target_weight: number;
        workout_frequency: number;
        preferred_days: [PreferredDay];
        workout_place: WorkoutPlace;
        preferred_equipment: [PreferredEquipment];
    };
    injuries: [Injury];
  }
  
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, dropDups: true },
    password: { type: String, required: true },
    image: { type: Object },
    gender: {
        type: String,
        enum: Gender,
        required: true
    },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    fitness_level: {
        type: String,
        enum: FitnessLevel,
        required: true
    },
    preferences: {
        fitness_goal: {
            type: String,
            enum: FitnessGoal,
            required: true
        },
        target_weight: { type: Number, required: true },
        workout_frequency: { type: Number, required: true },
        preferred_days: [{
            type: String,
            enum: PreferredDay,
            required: true
        }],
        workout_place: {
            type: String,
            enum: WorkoutPlace,
            required: true
        },
        preferred_equipment: [{
            type: String,
            enum: PreferredEquipment,
            required: true
        }]
    },
    injuries: [{
        type: String,
        enum: Injury,
        required: true
    }],
    dob: { type: Date },
    role: {
        type: String,
        enum: Role,
        default: Role.USER
    }
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, saltrounds);
    next();
});

export const userModel = mongoose.model<IUser>("users", userSchema);
