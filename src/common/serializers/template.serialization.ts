import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { Expose } from "class-transformer";

export class TemplateSerialization {
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
  @SwaggerResponseProperty({ type: ["string"] })
  exercises: string[];
}
