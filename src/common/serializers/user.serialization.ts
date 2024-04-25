import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";

class Preferences {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  fitness_goal: string;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  target_weight: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  workout_frequency: number;

  @Expose()
  @SwaggerResponseProperty({ type: {} })
  preferred_days: any;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  workout_place: string;

  @Expose()
  @SwaggerResponseProperty({ type: {} })
  preferred_equipment: any;
}

export class UserSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  email: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  image: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  role: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  gender: string;

  @Expose({ name: "dob" })
  @SwaggerResponseProperty({ type: "number" })
  @Transform(
    ({ value }) => new Date().getFullYear() - new Date(value).getFullYear()
  )
  age: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  height: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  weight: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  fitness_level: string;

  @Expose({ name: "preferences" })
  @SwaggerResponseProperty({ type: Preferences })
  @Transform(({ value }) => serialize(value, Preferences))
  preferences: object;

  @Expose()
  @SwaggerResponseProperty({ type: {} })
  injuries: any;
}
