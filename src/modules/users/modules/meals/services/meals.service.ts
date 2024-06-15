import { Meal } from "@common/models/meal.model";
import { CrudService } from "@lib/services/crud.service";
import { IEatCustomMeal } from "../validations/eat-custom-meal.validation";
import { EventsManager } from "@lib/events/events-manager";
import { Ingredient } from "@common/models/ingredient.model";
import { HttpError } from "@lib/error-handling/http-error";
import { ActivityType } from "@common/enums/activity-type.enum";
import { EatCustomMealEvent } from "../events/eat-custom-meal.event";
import { Types } from "mongoose";

export class MealsService extends CrudService(Meal) {
    async eatCustomMeal(id: string, body: IEatCustomMeal) {
      // Validate ingredients
      await Promise.all(
        body.ingredients.map(async i => {
          const ing = await Ingredient.findOne({ _id: new Types.ObjectId(i.id) });
          if(!ing) throw new HttpError(404, `Ingredient with id ${i} not found`);
          return {
            ingredient: ing,
            noServings: i.noServings,
          };
        })
      )

      EventsManager.emit(ActivityType.EAT_CUSTOM_MEAL, new EatCustomMealEvent(id, body.ingredients));
    }
}
