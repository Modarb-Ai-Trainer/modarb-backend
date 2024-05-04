import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";


class Days {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  title: string;

  @Expose({ name: "meals" })
  @SwaggerResponseProperty({ type: "string" })
  meals: string;
}

class KeyFeatures {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  day_number: number;

  @Expose({ name: "description" })
  @SwaggerResponseProperty({ type: {} })
  description: any;
}

export class WorkoutSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  image: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  description: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  Duration: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  Level: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  your_Journey: string;

  @Expose({ name: "key_Features" })
  @SwaggerResponseProperty({ type: [KeyFeatures] })
  @Transform(
    ({ value }) => serialize(value, KeyFeatures)
  )
  key_Features: any;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [Days] })
  @Transform(
    ({ value }) => serialize(value, Days)
  )
  days: any;

}