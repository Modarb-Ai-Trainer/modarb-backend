import mongoose from "mongoose";
import bcrypt from "bcrypt";
export const saltrounds = 5;
const { Schema } = mongoose;
enum Role {
    SUPER_ADMIN= "superAdmin",
    ADMIN= "admin"
}
const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, dropDups: true },
    password: { type: String, required: true },
    image: { type: Object, default: {} },
    permission: { type: Object, required: true },
    role: {
        type: String,
        enum: Role
    },
    gender: { type: String, required: true },
    dob: { type: Date }
});

adminSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, saltrounds);
    next();
});

export const adminModel = mongoose.model("admins", adminSchema);
