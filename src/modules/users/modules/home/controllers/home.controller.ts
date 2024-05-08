import { UserRegisteredWorkoutsService } from "../../user-registered-workouts/services/user-registered-workouts.service";
import { UserRegisteredMealPlansService } from "../../user-registered-meal-plans/services/user-registered-meal-plans.service";
import { UserService } from "../../users/services/users.service";
import { Request, Response } from "express";
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
import { HomeSerialization } from "common/serializers/home.serialization";


interface userRequest extends Request {
  jwtPayload?: any;
}

@Controller("/user/homePage")
@ControllerMiddleware(UsersGuardMiddleware())
export class homePageController extends BaseController {
  private userRegisteredWorkoutsService = new UserRegisteredWorkoutsService();
  private userRegisteredMealPlansService = new UserRegisteredMealPlansService();
  private userService = new UserService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.getHomePage));
  }


  @SwaggerGet()
  @SwaggerResponse(HomeSerialization)
  @SwaggerSummary("Home")
  @SwaggerDescription("Get home page")
  getHomePage = async (req: userRequest, res: Response) => {

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
    const data = {
      user: user,
      myWorkout: myWorkout,
      myMealPlan: {}
    }

    return JsonResponse.success(
      {
        data: serialize(data, HomeSerialization)
      },
      res
    );
  };

}
