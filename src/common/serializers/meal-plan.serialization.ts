import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";


class MealPlanDays {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  title: string;

  @Expose({ name: "meals" })
  @SwaggerResponseProperty({ type: {} })
  meals: any;
}

class MealPlanKeyFeatures {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  day_number: number;

  @Expose({ name: "description" })
  @SwaggerResponseProperty({ type: {} })
  description: any;
}

export class MealPlanSerialization {
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
  @SwaggerResponseProperty({ type: [MealPlanKeyFeatures] })
  @Transform(
    ({ value }) => serialize(value, MealPlanKeyFeatures)
  )
  key_Features: any;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [MealPlanDays] })
  @Transform(
    ({ value }) => serialize(value, MealPlanDays)
  )
  days: any;

}