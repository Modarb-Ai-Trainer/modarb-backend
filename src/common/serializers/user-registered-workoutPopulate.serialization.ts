import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { ExerciseSerialization } from "./exercise.serialization";
import { WorkoutSerialization } from "./workout.serialization";
import { UserSerialization } from "./user.serialization";


class MyWorkoutDaysPopulate {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  day_number: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  total_number_exercises: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  day_type: string;

  @Expose({ name: "exercises" })
  @SwaggerResponseProperty({ type: [ExerciseSerialization] })
  exercises: any;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_done: Boolean;
}

class MyWorkoutWeeksPopulate {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  week_number: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  week_name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  week_description: string;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [MyWorkoutDaysPopulate] })
  @Transform(({ value }) => serialize(value, MyWorkoutDaysPopulate))
  days: any;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_done: Boolean;
}

export class UserRegisteredWorkoutsPopulateSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  user: string;

  @Expose()
  @SwaggerResponseProperty({ type: WorkoutSerialization })
  workout: string;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_active: Boolean;

  @Expose({ name: "weeks" })
  @SwaggerResponseProperty({ type: [MyWorkoutWeeksPopulate] })
  @Transform(({ value }) => serialize(value, MyWorkoutWeeksPopulate))
  weeks: any;
}



export class UserRegisteredWorkoutsPopulateUserSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: UserSerialization })
  user: any;

  @Expose()
  @SwaggerResponseProperty({ type: WorkoutSerialization })
  workout: string;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_active: Boolean;

  @Expose({ name: "weeks" })
  @SwaggerResponseProperty({ type: [MyWorkoutWeeksPopulate] })
  @Transform(({ value }) => serialize(value, MyWorkoutWeeksPopulate))
  weeks: any;
}
