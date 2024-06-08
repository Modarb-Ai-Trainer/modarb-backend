import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { Expose } from "class-transformer";


export class UserNutriHomeDailyGoalsSerialization {
  @Expose()
  @SwaggerResponseProperty('number')
  waterGoal: number;

  @Expose()
  @SwaggerResponseProperty('number')
  waterConsumed: number;

  @Expose()
  @SwaggerResponseProperty('number')
  stepsGoal: number;

  @Expose()
  @SwaggerResponseProperty('number')
  stepsDone: number;

  @Expose()
  @SwaggerResponseProperty('number')
  exercisesCals: number;

  @Expose()
  @SwaggerResponseProperty('number')
  exercisesHours: number;

  @Expose()
  @SwaggerResponseProperty('number')
  sleepGoal: number;

  @Expose()
  @SwaggerResponseProperty('number')
  sleepDone: number;
}
