import { Expose, Transform } from "class-transformer";

export class ExerciseSerialization {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  name: string;
}
