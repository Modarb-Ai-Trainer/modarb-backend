import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";

class ExpectedDurationRange {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  min: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  max: number;
}

class Media {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  type: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  url: string;
}

class TargetMuscles {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  primary: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  secondary: string;
}

export class ExerciseSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  category: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  exerciseType: string;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  duration: number | null;

  @Expose({ name: "expectedDurationRange" })
  @SwaggerResponseProperty({ type: ExpectedDurationRange })
  @Transform(({ value }) => serialize(value, ExpectedDurationRange))
  expectedDurationRange: object;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  reps: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  sets: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  instructions: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  benefits: string;

  @Expose()
  @SwaggerResponseProperty({ type: TargetMuscles })
  targetMuscles: any;

  @Expose()
  @SwaggerResponseProperty({ type: ["string"] })
  equipments: any;
  
  @Expose()
  @SwaggerResponseProperty('string')
  coverImage: string;

  @Expose({ name: "media" })
  @SwaggerResponseProperty({ type: Media })
  @Transform(({ value }) => serialize(value, Media))
  media: Media;
}
