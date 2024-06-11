import { Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet, SwaggerPatch } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";
import { UserHomeService } from "../services/user-home.service";
import { IUserRequest } from "@common/interfaces/user-request.interface";
import { UserHomeYourDailyIntakeSerialization } from "../responses/user-home-your-daily-intake.serialization";
import { UserNutriHomeDailyGoalsSerialization } from "../responses/user-nutri-home-daily-goals.serialization";
import { UserRegisteredMealPlansPopulateSerialization } from "@common/serializers/user-registered-meal-planPopulate.serialization";
import { UserRegisteredMealPlansService } from "../../user-registered-meal-plans/services/user-registered-meal-plans.service";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";


@Controller("/user/nutri-guide")
@ControllerMiddleware(UsersGuardMiddleware())
export class homeNutriGuideController extends BaseController {
  private userHomeService = new UserHomeService();
  private userRegisteredMealPlansService = new UserRegisteredMealPlansService();

  setRoutes(): void {
    this.router.get("/todays-intake", asyncHandler(this.getHomePageYourDailyIntake));
    this.router.get("/daily-goals", asyncHandler(this.getHomePageDailyGoals));
    this.router.get("/today-meals", asyncHandler(this.getTodayMeals));
    this.router.patch(
      "/:id/progress/:day",
      asyncHandler(this.updateProgress)
    );
  }

  @SwaggerGet("/today-meals")
  @SwaggerResponse(UserRegisteredMealPlansPopulateSerialization)
  @SwaggerSummary("Get today's meals")
  @SwaggerDescription("Get today's meals for the user.")
  getTodayMeals = async (req: IUserRequest, res: Response): Promise<Response> => {
    try {
      const data = await this.userRegisteredMealPlansService.findOneOrFail(
        {
          user: req.jwtPayload.id, isActive: true},
        {
          populateArray: [
            { path: "meal_plan", select: "-days" },
            { path: "days.meals" }
          ],
        }
      );
      console.log(data);
      

      const dayToEat = data.days.find(day => day.is_eaten === false);

      if (dayToEat) {
        data.days = [dayToEat];
        return JsonResponse.success(
          {
            data: serialize(data, UserRegisteredMealPlansPopulateSerialization),
          },
          res
        );
      } else {
        return JsonResponse.success(
          {
            message: "All planned meals have been eaten.",
          },
          res
        );
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred." });
    }
  };

  @SwaggerPatch('/:id/progress/:day')
  @SwaggerResponse({})
  @SwaggerSummary("Update MyMealPlan Progress")
  @SwaggerDescription("Update the progress of a MyMealPlan")
  updateProgress = async (req: IUserRequest, res: Response) => {
    const urwId: string = req.params.id;
    const dayNumber: number = Number(req.params.day);
    await this.userRegisteredMealPlansService.updateForUser({
      urwId, dayNumber
    }, req.body, req.jwtPayload.id);
    return JsonResponse.success(
      {
        message: "mealPlan updated successfully",
      },
      res
    );
  };


  @SwaggerGet('/todays-intake')
  @SwaggerResponse(UserHomeYourDailyIntakeSerialization)
  @SwaggerSummary("Nutri home today's Intake")
  @SwaggerDescription("Get Nutriy page today's intake")
  getHomePageYourDailyIntake = async (req: IUserRequest, res: Response) => {
    // getting the daily intake
    const dailyIntake = await this.userHomeService.getHomePageYourDailyIntake(req.jwtPayload.id);

    // return response
    return JsonResponse.success(
      {
        data: serialize(dailyIntake, UserHomeYourDailyIntakeSerialization)
      },
      res
    );
  };


  @SwaggerGet('/daily-goals')
  @SwaggerResponse(UserNutriHomeDailyGoalsSerialization)
  @SwaggerSummary("Nutri Home Daily Goals")
  @SwaggerDescription("Get Nutri daily goals for user home")
  getHomePageDailyGoals = async (req: IUserRequest, res: Response) => {
    const dailyGoals = await this.userHomeService.getNutriHomeDailyGoals(req.jwtPayload.id)

    return JsonResponse.success(
      {
        data: serialize(dailyGoals, UserNutriHomeDailyGoalsSerialization)
      },
      res
    );
  }
}
