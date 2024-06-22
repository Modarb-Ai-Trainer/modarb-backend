import { Meal } from "@common/models/meal.model";
import { CrudService } from "@lib/services/crud.service";
import { IEatCustomMeal } from "../validations/eat-custom-meal.validation";
import { EventsManager } from "@lib/events/events-manager";
import { Ingredient } from "@common/models/ingredient.model";
import { HttpError } from "@lib/error-handling/http-error";
import { Types } from "mongoose";
import { MealDoneEvent } from "../events/meal-done.event";
import { MealType } from "@common/enums/meal-type.enum";

export class MealsService extends CrudService(Meal) {
    async eatCustomMeal(userId: string, body: IEatCustomMeal) {
      // Validate ingredients
      const customMealIngs = await Promise.all(
        body.ingredients.map(async i => {
          const ing = await Ingredient.findOne({ _id: new Types.ObjectId(i.id) });
          if(!ing) throw new HttpError(404, `Ingredient with id ${i} not found`);
          return {
            ingredient: ing,
            noServings: i.noServings,
          };
        })
      );

      // Create meal
      const meal = await this.create({
        name: `${(new Date()).toISOString()} - Custom Meal - ${userId}`,
        image: "https://via.placeholder.com/150",
        type: MealType.CUSTOM,
        ingredients: customMealIngs.map(i => i.ingredient._id),
        calories: customMealIngs.reduce((acc, curr) => acc + curr.ingredient.calories * curr.noServings, 0),
        proteins: customMealIngs.reduce((acc, curr) => acc + curr.ingredient.proteins * curr.noServings, 0),
        carbs: customMealIngs.reduce((acc, curr) => acc + curr.ingredient.carbs * curr.noServings, 0),
        fats: customMealIngs.reduce((acc, curr) => acc + curr.ingredient.fats * curr.noServings, 0),
        isDeleted: true,
      });

      EventsManager.emit(MealDoneEvent.name, new MealDoneEvent(userId, meal._id.toString()));
    }
}
