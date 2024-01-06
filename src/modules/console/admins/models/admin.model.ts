import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Role } from "../enums/roles.enum";
import { config } from "../../../../configs/config";
const { Schema } = mongoose;

export interface IAdmin {
  name: string;
  email: string;
  password: string;
  image: object;
  role: Role;
  gender: string;
  dob: Date;
}

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, dropDups: true },
  password: { type: String, required: true },
  image: { type: Object, default: {} },
  role: {
    type: String,
    enum: Role,
  },
  gender: { type: String, required: true },
  dob: { type: Date },
});

AdminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, config.saltRounds);
  next();
});

export const Admin = mongoose.model<IAdmin>("admins", AdminSchema);
