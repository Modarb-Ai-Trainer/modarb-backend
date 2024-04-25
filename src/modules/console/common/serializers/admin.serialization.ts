import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { Expose, Transform } from "class-transformer";

export class AdminSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty("string")
  id: string;

  @Expose()
  @SwaggerResponseProperty("string")
  name: string;

  @Expose()
  @SwaggerResponseProperty("string")
  email: string;

  @Expose()
  @SwaggerResponseProperty({
    type: {},
  })
  image: object;

  @Expose()
  @SwaggerResponseProperty("string")
  role: string;

  @Expose()
  @SwaggerResponseProperty("string")
  gender: string;

  @Expose({ name: "dob" })
  @SwaggerResponseProperty("number")
  @Transform(
    ({ value }) => new Date().getFullYear() - new Date(value).getFullYear()
  )
  age: number;
}
