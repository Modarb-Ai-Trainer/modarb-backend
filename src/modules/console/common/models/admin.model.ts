import mongoose, { UpdateQuery } from "mongoose";
import bcrypt from "bcrypt";
import { Role } from "@common/enums/role.enum";
import { saltrounds } from "@common/models/user.model";

const { Schema } = mongoose;

export interface IAdmin {
  name: string;
  email: string;
  password: string;
  image: String;
  gender: string;
  role: Role;
}

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, dropDups: true },
  password: { type: String, required: true },
  image: { type: String, default: {} },
  gender: { type: String, required: true },
  role: {
    type: String,
    enum: Role
  },
});

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltrounds);
  }
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

AdminSchema.pre(["updateOne", "findOneAndUpdate"], async function () {
  const data = this.getUpdate() as UpdateQuery<IAdmin>;
  if (data.password) {
    data.password = await bcrypt.hash(data.password, saltrounds);
  }
  if (data.email) {
    data.email = data.email.toLowerCase();
  }
});

// pre find make email case insensitive
AdminSchema.pre(["find", "findOne"], function () {
  const query = this.getQuery();
  if (query.email) {
    query.email = query.email.toLowerCase();
  }
});

export type AdminDocument = mongoose.Document & IAdmin;

export const Admin = mongoose.model<AdminDocument>("admins", AdminSchema);
