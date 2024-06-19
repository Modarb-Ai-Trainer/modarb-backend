import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IEquipment {
  name: string;
  image: string;
  isDeleted: boolean;
}

const equipmentSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  image: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

export type EquipmentDocument = IEquipment & mongoose.Document;

export const Equipment = mongoose.model<EquipmentDocument>(
  "equipments",
  equipmentSchema
);
