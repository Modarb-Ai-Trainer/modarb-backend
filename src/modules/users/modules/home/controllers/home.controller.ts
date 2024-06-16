import { UserRegisteredWorkoutsService } from "../../user-registered-workouts/services/user-registered-workouts.service";
import { UserService } from "../../users/services/users.service";
import { Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { HomeSerialization } from "../responses/home.serialization";
import { HomeStreakSerialization } from "../responses/home-streak.serialization";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";
import { queryValidator } from "@helpers/validation.helper";
import { homeStreakQueryValidation } from "../validations/home-streak.query.validation";
import { UserHomeService } from "../services/user-home.service";
import { IUserRequest } from "@common/interfaces/user-request.interface";
import { UserHomeYourDailyIntakeSerialization } from "../responses/user-home-your-daily-intake.serialization";
import { UserHomeDailyGoalsSerialization } from "../responses/user-home-daily-goals.serialization";
import { GetMyMealPlanSerialization } from "@common/serializers/user-registered-meal-planPopulate.serialization";
import { UserRegisteredMealPlansService } from "../../user-registered-meal-plans/services/user-registered-meal-plans.service";
import { number } from "joi";

@Controller("/user/homePage")
@ControllerMiddleware(UsersGuardMiddleware())
export class homePageController extends BaseController {
  private userRegisteredWorkoutsService = new UserRegisteredWorkoutsService();
  private userService = new UserService();
  private userHomeService = new UserHomeService();
  private userRegisteredMealPlansService = new UserRegisteredMealPlansService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.getHomePage));
    this.router.get("/streak", queryValidator(homeStreakQueryValidation), asyncHandler(this.getHomePageStreak));
    this.router.get("/your-daily-intake", asyncHandler(this.getHomePageYourDailyIntake));
    this.router.get("/daily-goals", asyncHandler(this.getHomePageDailyGoals));
  }

  @SwaggerGet('/streak')
  @SwaggerResponse(HomeStreakSerialization)
  @SwaggerQuery({
    startDate: {
      type: "string",
      required: true,
    },
    endDate: {
      type: "string",
      required: true,
    },
  })
  @SwaggerSummary("Home Streak Weeks")
  @SwaggerDescription("Get home page streak weeks")
  getHomePageStreak = async (req: IUserRequest, res: Response) => {
    // getting the query params
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    // getting the streak weeks
    const streak = await this.userHomeService.getHomePageStreak(req.jwtPayload.id, startDate, endDate);

    // return response
    return JsonResponse.success(
      {
        data: serialize(streak, HomeStreakSerialization)
      },
      res
    );
  };


  @SwaggerGet('/your-daily-intake')
  @SwaggerResponse(UserHomeYourDailyIntakeSerialization)
  @SwaggerSummary("Home Your Daily Intake")
  @SwaggerDescription("Get home page your daily intake")
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
  @SwaggerResponse(UserHomeDailyGoalsSerialization)
  @SwaggerSummary("Home Daily Goals")
  @SwaggerDescription("Get daily goals for user home")
  getHomePageDailyGoals = async (req: IUserRequest, res: Response) => {
    const dailyGoals = await this.userHomeService.getDailyGoals(req.jwtPayload.id)

    return JsonResponse.success(
      {
        data: serialize(dailyGoals, UserHomeDailyGoalsSerialization)
      },
      res
    );
  }


  @SwaggerGet()
  @SwaggerResponse(HomeSerialization)
  @SwaggerSummary("Home")
  @SwaggerDescription("Get home page")
  getHomePage = async (req: IUserRequest, res: Response) => {
    const user = await this.userService.findOneOrFail(
      { _id: req.jwtPayload.id },
      { selectArray: ["preferences", "name", "fitness_level", "injuries"] }
    )

    const myWorkout = await this.userRegisteredWorkoutsService.findOneOrFail(
      { user: req.jwtPayload.id, is_active: true },
      {
        populateArray: [
          { path: "workout", select: ["name", "min_per_day"] },
        ],
        selectArray: ["-weeks.week_description", "-weeks.week_name", "-weeks.days.exercises", "-user"],
      },
    )

    let myMealPlan = await this.userRegisteredMealPlansService.findOneOrFail(
      {
        user: req.jwtPayload.id, isActive: true
      },
      {
        populateArray: [
          { path: "meal_plan", select: "-days" },
          {
            path: "days.meals",
            populate: { path: "ingredients" }
          }
        ],
      }
    );


    const dayToEat = myMealPlan.days.find(day => day.is_eaten === false);
    const totalCalories = dayToEat.meals.reduce((sum, meal: any) => sum + meal.calories, 0);

    const totals = dayToEat.meals.reduce((totals, meal: any) => {
      if (meal.type === "breakfast" || meal.type === "lunch" || meal.type === "dinner") {
        totals.meals += 1;
      } else if (meal.type === "snacks") {
        totals.snacks += 1;
      }
      return totals;
    }, { meals: 0, snacks: 0 });

    const data = {
      user: user,
      myWorkout: myWorkout,
      myMealPlan: {
        id: myMealPlan._id,
        today: {
          numberOfMeals: totals.meals,
          numberOfSnacks: totals.snacks,
          totalCalories: totalCalories,
        },
      }
    }



    return JsonResponse.success(
      {
        data: serialize(data, HomeSerialization)
      },
      res
    );
  };
}
