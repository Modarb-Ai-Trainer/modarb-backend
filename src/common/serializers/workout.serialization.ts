import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";



class Days {
  @Expose()
  day_number: number;

  @Expose()
  total_number_exercises: number;

  @Expose()
  day_type: string;

  @Expose({ name: "exercises" })
  exercises: any;
}

class TemplateWeeks {
  @Expose()
  week_number: number;

  @Expose()
  week_name: string;

  @Expose()
  week_description: string;

  @Expose({ name: "days" })
  @Transform(
    ({ value }) => serialize(value, Days)
  )
  days: any;
}

export class WorkoutSerialization {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  type: string;

  @Expose()
  image: string;

  @Expose()
  created_by: string;

  @Expose()
  fitness_level: string;

  @Expose()
  fitness_goal: string;

  @Expose()
  place: any;

  @Expose()
  min_per_day: number;

  @Expose()
  total_number_days: number;

  @Expose({ name: "template_weeks" })
  @Transform(
    ({ value }) => serialize(value, TemplateWeeks)
  )
  template_weeks: any;

}