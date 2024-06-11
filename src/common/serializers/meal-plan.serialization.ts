import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";


class MealPlanDays {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  title: string;

  @Expose({ name: "meals" })
  @SwaggerResponseProperty({ type: ["string"] })
  meals: any;
}

class MealPlanKeyFeatures {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  title: string;

  @Expose({ name: "description" })
  @SwaggerResponseProperty({ type: "string" })
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
  duration: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  level: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  your_journey: string;

  @Expose({ name: "key_features" })
  @SwaggerResponseProperty({ type: [MealPlanKeyFeatures] })
  @Transform(
    ({ value }) => serialize(value, MealPlanKeyFeatures)
  )
  key_features: any;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [MealPlanDays] })
  @Transform(
    ({ value }) => serialize(value, MealPlanDays)
  )
  days: any;

}