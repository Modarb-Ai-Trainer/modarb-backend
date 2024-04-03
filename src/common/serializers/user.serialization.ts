import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";

class Preferences {
  @Expose()
  fitness_goal: string;

  @Expose()
  target_weight: number;

  @Expose()
  workout_frequency: number;

  @Expose()
  preferred_days: any;

  @Expose()
  workout_place: string;

  @Expose()
  preferred_equipment: any;
}


export class UserSerialization {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  image: string;

  @Expose()
  role: string;

  @Expose()
  gender: string;

  @Expose({ name: "dob" })
  @Transform(
    ({ value }) => new Date().getFullYear() - (new Date(value).getFullYear())
  )
  age: number;

  @Expose()
  height: number;

  @Expose()
  weight: number;

  @Expose()
  fitness_level: string;

  @Expose({ name: "preferences" })
  @Transform(
    ({ value }) => serialize(value, Preferences)
  )
  preferences: object;

  @Expose()
  injuries: any;

}