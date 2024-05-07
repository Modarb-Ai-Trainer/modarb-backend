import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { Expose } from "class-transformer";
import { ExerciseSerialization } from "./exercise.serialization";

export class TemplatePopulateSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  user: string;

  @Expose()
  @SwaggerResponseProperty({ type: "Date" })
  creationDate: Date;

  @Expose()
  @SwaggerResponseProperty({ type: [ExerciseSerialization] })
  exercises: any;
}
