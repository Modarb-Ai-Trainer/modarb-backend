import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";

class ExpectedDurationRange {
  @Expose()
  min: number;

  @Expose()
  max: number;
}

class Media {
  @Expose()
  type: string;

  @Expose()
  url: string;
}

export class ExerciseSerialization {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  name: string;

  @Expose()
  category: string;

  @Expose()
  duration: number | null;

  @Expose({ name: "expectedDurationRange" })
  @Transform(
    ({ value }) => serialize(value, ExpectedDurationRange)
  )
  expectedDurationRange: object;

  @Expose()
  reps: number;

  @Expose()
  sets: number;

  @Expose()
  instructions: string;

  @Expose()
  benefits: string;

  @Expose()
  targetMuscles: any;

  @Expose()
  equipments: any;

  @Expose({ name: "media" })
  @Transform(
    ({ value }) => serialize(value, Media)
  )
  media: object;
}
