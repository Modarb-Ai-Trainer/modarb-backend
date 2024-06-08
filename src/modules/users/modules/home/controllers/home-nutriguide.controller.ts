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
import { UserHomeService } from "../services/user-home.service";
import { IUserRequest } from "@common/interfaces/user-request.interface";
import { UserHomeYourDailyIntakeSerialization } from "../responses/user-home-your-daily-intake.serialization";
import { UserNutriHomeDailyGoalsSerialization } from "../responses/user-nutri-home-daily-goals.serialization";


@Controller("/user/nutri-guide")
@ControllerMiddleware(UsersGuardMiddleware())
export class homeNutriGuideController extends BaseController {
  private userHomeService = new UserHomeService();

  setRoutes(): void {
    this.router.get("/todays-intake", asyncHandler(this.getHomePageYourDailyIntake));
    this.router.get("/daily-goals", asyncHandler(this.getHomePageDailyGoals));
  }


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
