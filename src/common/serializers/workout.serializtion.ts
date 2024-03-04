import { Expose, Transform } from "class-transformer";

export class WorkoutSerialization {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  name: string;

}