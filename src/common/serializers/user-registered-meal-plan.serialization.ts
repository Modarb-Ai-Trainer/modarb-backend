import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";



class MealDays {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  day_number: number;

  @Expose({ name: "meals" })
  @SwaggerResponseProperty({ type: ["string"] })
  meals: any;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  is_eaten: boolean;

}

export class UserRegisteredMealPlansSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  user: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  meal_plan: string;

  @Expose()
  @SwaggerResponseProperty({ type: "boolean" })
  isActive: boolean;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [MealDays] })
  @Transform(
    ({ value }) => serialize(value, MealDays)
  )
  days: any;

}