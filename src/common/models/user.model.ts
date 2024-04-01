import mongoose, { UpdateQuery } from "mongoose";
import bcrypt from "bcrypt";
import { AuthenticatableType } from "@common/enums/authenticatable-type.enum";
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { FitnessLevel } from "@common/enums/fitness-level.enum";
import { Gender } from "@common/enums/gender.enum";
import { Injury } from "@common/enums/injury.enum";
import { PreferredDay } from "@common/enums/preferred-day.enum";
import { PreferredEquipment } from "@common/enums/preferred-equipment.enum";
import { WorkoutPlace } from "@common/enums/workout-place.enum";
export const saltrounds = 5;
const { Schema } = mongoose;

export interface IUser {
  name: string;
  email: string;
  password: string;
  image: object;
  role: AuthenticatableType;
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
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: Object },
  gender: {
    type: String,
    enum: Gender,
    required: true,
  },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  fitness_level: {
    type: String,
    enum: FitnessLevel,
    required: true,
  },
  preferences: {
    fitness_goal: {
      type: String,
      enum: FitnessGoal,
      required: true,
    },
    target_weight: { type: Number, required: true },
    workout_frequency: { type: Number },
    preferred_days: [
      {
        type: String,
        enum: PreferredDay,
      },
    ],
    workout_place: {
      type: String,
      enum: WorkoutPlace,
      required: true,
    },
    preferred_equipment: [
      {
        type: String,
        enum: PreferredEquipment,
        required: true,
      },
    ],
  },
  injuries: [
    {
      type: String,
      enum: Injury,
      required: true,
    },
  ],
  dob: { type: Date },
  role: {
    type: String,
    enum: AuthenticatableType,
    default: AuthenticatableType.USER,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltrounds);
  }
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

userSchema.pre(["updateOne", "findOneAndUpdate"], async function () {
  const data = this.getUpdate() as UpdateQuery<IUser>;
  if (data.password) {
    data.password = await bcrypt.hash(data.password, saltrounds);
  }
  if (data.email) {
    data.email = data.email.toLowerCase();
  }
});

// pre find make email case insensitive
userSchema.pre(["find", "findOne"], function () {
  const query = this.getQuery();
  if (query.email) {
    query.email = query.email.toLowerCase();
  }
});

export type UserDocument = IUser & mongoose.Document;

export const User = mongoose.model<UserDocument>("users", userSchema);
