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

  @Expose()
  is_done: Boolean
}

class Weeks {
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

  @Expose()
  is_done: Boolean
}

export class UserRegisteredWorkoutsSerialization {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  user: string;

  @Expose()
  workout: string;

  @Expose()
  is_active: Boolean;

  @Expose({ name: "weeks" })
  @Transform(
    ({ value }) => serialize(value, Weeks)
  )
  weeks: any;

}