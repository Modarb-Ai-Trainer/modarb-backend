import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";
import { Expose } from "class-transformer";

class HSDaysSerialization {
  @Expose()
  @SwaggerResponseProperty('string')
  day: string;

  @Expose()
  @SwaggerResponseProperty('number')
  points: number;
}

export class HomeStreakSerialization {
  @Expose()
  @SwaggerResponseProperty({ type: [HSDaysSerialization]})
  days: HSDaysSerialization[];
}
