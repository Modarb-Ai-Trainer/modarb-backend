import { Ingredient } from "@common/models/ingredient.model";
import { CrudService } from "@lib/services/crud.service";

export class IngredientsService extends CrudService(Ingredient) {}