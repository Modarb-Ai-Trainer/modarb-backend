import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { ListMealPlanSerialization } from "@common/serializers/meal-planPopulate.serialization";
import { MealPopulateSerialization } from "./mealPopulate.serialization";
import { MealPlanSerialization } from "./meal-plan.serialization";



class MealDaysPopulate {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  day_number: number;

  @Expose({ name: "meals" })
  @SwaggerResponseProperty({ type: [MealPopulateSerialization] })
  @Transform(
    ({ value }) => serialize(value, MealPopulateSerialization)
  )
  meals: any;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_eaten: boolean;

}

export class UserRegisteredMealPlansPopulateSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  user: string;

  @Expose()
  @SwaggerResponseProperty({ type: MealPlanSerialization })
  @Transform(
    ({ value }) => serialize(value, MealPlanSerialization)
  )
  meal_plan: string;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  isActive: boolean;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [MealDaysPopulate] })
  @Transform(
    ({ value }) => serialize(value, MealDaysPopulate)
  )
  days: any;

}

export class GetMyMealPlanSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  user: string;

  @Expose()
  @SwaggerResponseProperty({ type: ListMealPlanSerialization })
  meal_plan: any;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  isActive: boolean;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [MealDaysPopulate] })
  @Transform(
    ({ value }) => serialize(value, MealDaysPopulate)
  )
  days: any;

}