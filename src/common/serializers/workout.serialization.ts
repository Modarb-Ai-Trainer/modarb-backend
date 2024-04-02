import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";



class Days {
  @Expose()
  day: number;

  @Expose({ name: "exercises" })
  exercises: any;
}


class TemplateWeeks {
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
  type: string;

  @Expose()
  image: object;

  @Expose()
  created_by: string;

  @Expose({ name: "templateWeeks" })
  @Transform(
    ({ value }) => serialize(value, TemplateWeeks)
  )
  templateWeeks: any;

}