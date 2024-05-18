import { Expose, Transform } from "class-transformer";
import { serialize } from "@helpers/serialize";
import { EquipmentSerialization } from "./muscle.serialization";
import { MuscleSerialization } from "./equipment.serialization";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";

class ExpectedDurationRangePopulate {
  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  min: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  max: number;
}

class MediaPopulate {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  type: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  url: string;
}

class TargetMusclesPopulate {
  @Expose()
  @SwaggerResponseProperty({ type: MuscleSerialization })
  primary: string;

  @Expose()
  @SwaggerResponseProperty({ type: MuscleSerialization })
  secondary: string;
}

export class ExercisePopulateSerialization {
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
  @SwaggerResponseProperty({ type: ExpectedDurationRangePopulate })
  @Transform(({ value }) => serialize(value, ExpectedDurationRangePopulate))
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
  @SwaggerResponseProperty({ type: [TargetMusclesPopulate] })
  targetMuscles: any;

  @Expose()
  @SwaggerResponseProperty({ type: [EquipmentSerialization] })
  equipments: any;

  @Expose()
  @SwaggerResponseProperty('string')
  coverImage: string;

  @Expose({ name: "media" })
  @SwaggerResponseProperty({ type: MediaPopulate })
  @Transform(({ value }) => serialize(value, MediaPopulate))
  media: object;
}
