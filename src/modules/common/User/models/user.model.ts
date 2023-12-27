import mongoose from "mongoose";
import bcrypt from "bcrypt";
export const saltrounds = 5;
const { Schema } = mongoose;
enum Role {
    USER = "user"
}
enum Gender {
    MALE = "male",
    FEMALE = "female"
}
enum FitnessLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
enum FitnessGoal {
    LOSE_WEIGHT = "lose weight",
    GAIN_MUSCLE = "gain muscle",
    GET_FITTER = "get fitter"
}
enum WorkoutPlace {
    GYM = "gym",
    HOME = "home",
    BOTH = "both"
}
enum PreferredDay {
    SATURDAY = "saturday",
    SUNDAY = "sunday",
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday"
}
enum PreferredEquipment {
    BARBELLS = "barbells",
    DUMBBELLS = "dumbbells",
    GYM_MACHINES = "gym machines",
    RESISTANCE_BAND = "resistance band",
    BODYWEIGHT = "bodyweight"
}
enum Injurie {
    NECK = "neck",
    SHOULDERS = "shoulders",
    BACK = "back",
    ARMS = "arms",
    KNEES = "knees"
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
        enum: Injurie,
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

export const userModel = mongoose.model("users", userSchema);
