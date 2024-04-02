import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";



class Days {
  @Expose()
  day: number;

  @Expose({ name: "exercises" })
  exercises: any;

  @Expose()
  isDone: Boolean
}


class Weeks {
  @Expose({ name: "days" })
  @Transform(
    ({ value }) => serialize(value, Days)
  )
  days: any;
}

export class UserRegisteredWorkoutsSerialization {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  user: string;

  @Expose()
  workout: string;

  @Expose()
  isActive: Boolean;

  @Expose({ name: "weeks" })
  @Transform(
    ({ value }) => serialize(value, Weeks)
  )
  weeks: any;

}