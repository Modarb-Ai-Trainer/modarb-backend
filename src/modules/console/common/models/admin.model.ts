import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "../../../../configs/config";
import { Role } from "@common/enums/role.enum";

const { Schema } = mongoose;

export interface IAdmin {
  name: string;
  email: string;
  password: string;
  image: object;
  gender: string;
  dob: Date;
  role: Role;
}

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, dropDups: true },
  password: { type: String, required: true },
  image: { type: Object, default: {} },
  gender: { type: String, required: true },
  dob: { type: Date },
  role: {
    type: String,
    enum: Role
  },
});

AdminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, config.saltRounds);
  next();
});

export type AdminDocument = mongoose.Document & IAdmin;

export const Admin = mongoose.model<AdminDocument>("admins", AdminSchema);
