import { Expose } from "class-transformer";
import { SwaggerResponseProperty } from "@lib/decorators/swagger-response-property.decorator";


export class IngredientSerialization {
  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  name: string;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  serving_size: number;

  @Expose()
  @SwaggerResponseProperty({ type: "number" })
  servings_count: number;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  serving_size_unit: string;

  @Expose()
  @SwaggerResponseProperty({ type: "string" })
  servings_count_unit: string;

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
}