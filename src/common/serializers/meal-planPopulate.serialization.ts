import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { MealSerialization } from './meal.serialization';
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";


class MealPlanDaysPopulate {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  title: string;

  @Expose({ name: "meals" })
  @SwaggerResponseProperty({ type: MealSerialization })
  meals: any;
}

class MealPlanKeyFeaturesPopulate {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  title: string;

  @Expose({ name: "description" })
  @SwaggerResponseProperty({ type: "string" })
  description: any;
}

export class MealPlanPopulateSerialization {
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
  @SwaggerResponseProperty({ type: [MealPlanKeyFeaturesPopulate] })
  @Transform(
    ({ value }) => serialize(value, MealPlanKeyFeaturesPopulate)
  )
  key_features: any;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [MealPlanDaysPopulate] })
  @Transform(
    ({ value }) => serialize(value, MealPlanDaysPopulate)
  )
  days: any;

}

export class ListMealPlanSerialization {
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
  @SwaggerResponseProperty({ type: [MealPlanKeyFeaturesPopulate] })
  @Transform(
    ({ value }) => serialize(value, MealPlanKeyFeaturesPopulate)
  )
  key_features: any;

}


export class MSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  image: string;
}