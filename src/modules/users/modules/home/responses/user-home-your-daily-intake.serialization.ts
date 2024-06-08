import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { Expose } from "class-transformer";


export class UserHomeYourDailyIntakeSerialization {
  @Expose()
  @SwaggerResponseProperty('number')
  caloriesGoal: number;

  @Expose()
  @SwaggerResponseProperty('number')
  caloriesLeft: number;

  @Expose()
  @SwaggerResponseProperty('number')
  caloriesBurned: number;

  @Expose()
  @SwaggerResponseProperty('number')
  carbsGoal: number;
  
  @Expose()
  @SwaggerResponseProperty('number')
  carbsConsumed: number;

  @Expose()
  @SwaggerResponseProperty('number')
  proteinGoal: number;

  @Expose()
  @SwaggerResponseProperty('number')
  proteinConsumed: number;

  @Expose()
  @SwaggerResponseProperty('number')
  fatGoal: number;

  @Expose()
  @SwaggerResponseProperty('number')
  fatConsumed: number;
}
