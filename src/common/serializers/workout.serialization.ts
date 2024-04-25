import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";



class Days {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  day_number: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  total_number_exercises: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  day_type: string;

  @Expose({ name: "exercises" })
  @SwaggerResponseProperty({ type: {} })
  exercises: any;
}

class TemplateWeeks {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  week_number: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  week_name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  week_description: string;

  @Expose({ name: "days" })
  @SwaggerResponseProperty({ type: [Days] })
  @Transform(
    ({ value }) => serialize(value, Days)
  )
  days: any;
}

export class WorkoutSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  description: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  type: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  image: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  created_by: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  fitness_level: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  fitness_goal: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  place: any;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  min_per_day: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  total_number_days: number;

  @Expose({ name: "template_weeks" })
  @SwaggerResponseProperty({ type: [TemplateWeeks] })
  @Transform(
    ({ value }) => serialize(value, TemplateWeeks)
  )
  template_weeks: any;

}