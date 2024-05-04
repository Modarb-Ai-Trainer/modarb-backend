import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { ExerciseSerialization } from "./exercise.serialization";

class Days {
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

class Weeks {
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
  @SwaggerResponseProperty({ type: [Days] })
  @Transform(({ value }) => serialize(value, Days))
  days: any;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_done: Boolean;
}

export class UserRegisteredWorkoutsSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  user: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  workout: string;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_active: Boolean;

  @Expose({ name: "weeks" })
  @SwaggerResponseProperty({ type: [Weeks] })
  @Transform(({ value }) => serialize(value, Weeks))
  weeks: any;
}
