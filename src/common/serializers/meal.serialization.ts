import { Expose } from "class-transformer";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";


export class MealSerialization {
  @Expose({ name: "_id" })
  @SwaggerResponseProperty({ type: "string" })
  id: string;
  
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  created_at: Date;

  @Expose()
  @SwaggerResponseProperty({ type: ["string"] })
  ingredients: any;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  calories: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  carbs: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  proteins: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  fats: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  type: string;
}