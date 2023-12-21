import mongoose from "mongoose";
import bcrypt from "bcrypt";
export const saltrounds = 5;
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, dropDups: true },
    password: { type: String, required: true },
    image: { type: Object, default: {} },
    gender: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    fitness_level: { type: Number, required: true },
    preferences: { 
        fitness_goal: { type: Number, required: true },
        target_weight: { type: Number, required: true },
        workout_frequency: { type: Number, required: true },
        preferred_days: [{ type: String, required: true }],
        workout_place: { type: String, required: true },
        preferred_equipments: { type: String, required: true }
    },
    injuries: [{ type: String, required: true }],
    dob: { type: Date }
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, saltrounds);
    next();
});

export const userModel = mongoose.model("users", userSchema);
