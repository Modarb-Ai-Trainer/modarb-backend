import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { MealSerialization } from "./meal.serialization";
import { MealPlanSerialization } from "./meal-plan.serialization";



class MealDaysPopulate {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  day_number: number;

  @Expose({ name: "meals" })
  @SwaggerResponseProperty({ type: [MealSerialization] })
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