import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";


class DaysInHome {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  day_number: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  total_number_exercises: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  day_type: string;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_done: Boolean;


}

class weeksInHome {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  week_number: number;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_done: Boolean;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [DaysInHome] })
  @Transform(({ value }) => serialize(value, DaysInHome))
  days: any;
}

class WorkoutInHome {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  min_per_day: number;
}

class MyWorkoutHome {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: WorkoutInHome })
  @Transform(({ value }) => serialize(value, WorkoutInHome))
  workout: any;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_active: boolean;

  @Expose()
  @SwaggerResponseProperty({ type: weeksInHome })
  @Transform(({ value }) => serialize(value, weeksInHome))
  weeks: any;
}

class PreferencesUserHome {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  fitness_goal: string;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  target_weight: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  workout_frequency: number;

  @Expose({ name: "preferred_days" })
  @SwaggerResponseProperty({ type: ["string"] })
  preferred_days: any;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  workout_place: string;

  @Expose()
  @SwaggerResponseProperty({ type: ["string"] })
  preferred_equipment: any;
}

class UserHome {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  name: string;

  @Expose({ name: "preferences" })
  @SwaggerResponseProperty({ type: PreferencesUserHome })
  @Transform(({ value }) => serialize(value, PreferencesUserHome))
  preferences: any;

  @Expose()
  @SwaggerResponseProperty({ type: ["string"] })
  injuries: any;
}

export class HomeSerialization {
  @Expose()
  @SwaggerResponseProperty({ type: UserHome })
  @Transform(({ value }) => serialize(value, UserHome))
  user: any;

  @Expose()
  @SwaggerResponseProperty({ type: MyWorkoutHome })
  @Transform(({ value }) => serialize(value, MyWorkoutHome))
  myWorkout: any;

  @Expose({ name: "myMealPlan" })
  @SwaggerResponseProperty({ type: {} })
  myMealPlan: any;
}
