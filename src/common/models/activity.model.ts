import mongoose, { Types } from "mongoose";
import { MealDocument } from "./meal.model";
import { MealPlanDocument } from "./meal-plan.model";
import { WorkoutDocument } from "./workout.model";
import { ExerciseDocument } from "./exercise.model";
import { ActivityType } from "@common/enums/activity-type.enum";
const { Schema } = mongoose;

export type RelatedItem = | MealDocument 
                          | MealPlanDocument 
                          | WorkoutDocument
                          | ExerciseDocument 
                          | { 
                              ingredients: {
                                id: string,
                                noServings: number
                              }[];
                            }
export type AMetaData = {};

export interface IActivity {
  related_item?: RelatedItem;
  meta_data?: AMetaData;
  activity_type: ActivityType;
  related_id?: string | Types.ObjectId;
  user_id: string | Types.ObjectId;
  created_at?: Date;
}

const activitySchema = new Schema({
  related_item: {
    type: Schema.Types.Mixed,
    required: false,
  },
  meta_data: {
    type: Schema.Types.Mixed,
    default: {},
  },
  activity_type: {
    type: String,
    enum: Object.values(ActivityType),
  },
  related_id: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export type ActivityDocument = IActivity & mongoose.Document;

export const Activity = mongoose.model<ActivityDocument>(
  "activities",
  activitySchema
);
