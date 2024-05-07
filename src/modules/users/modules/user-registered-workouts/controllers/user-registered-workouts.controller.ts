import { UserRegisteredWorkoutsService } from "../services/user-registered-workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { UserRegisteredWorkoutsSerialization } from "@common/serializers/user-registered-workout.serialization";
import { UserRegisteredWorkoutsPopulateSerialization, UserRegisteredWorkoutsPopulateUserSerialization } from "@common/serializers/user-registered-workoutPopulate.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { createUserRegisteredWorkoutsSchema } from "../validations/create-user-registered-workouts.validation";
import {
  SwaggerGet,
  SwaggerPost,
} from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";4


interface userRequest extends Request {
  jwtPayload?: any;
}

@Controller("/user/myWorkouts")
@ControllerMiddleware(UsersGuardMiddleware())
export class userRegisteredWorkoutsController extends BaseController {
  private userRegisteredWorkoutsService = new UserRegisteredWorkoutsService();

  setRoutes(): void {
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    this.router.get(
      "/home/:userId",
      paramsValidator("userId"),
      asyncHandler(this.getHomePage)
    );
    this.router.get("/", asyncHandler(this.list));
    this.router.post(
      "/",
      bodyValidator(createUserRegisteredWorkoutsSchema),
      asyncHandler(this.create)
    );
  }

  @SwaggerGet()
  @SwaggerResponse([UserRegisteredWorkoutsPopulateSerialization])
  @SwaggerSummary("List my workouts")
  @SwaggerDescription("List all user registered workouts (workouts that the user had started)")
  list = async (req: userRequest, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } =
      await this.userRegisteredWorkoutsService.list(
        { user: req.jwtPayload.id, is_active: true },
        paginationQuery,
        {
          populateArray: [
            { path: "workout" },
            { path: "weeks.days.exercises" },
          ],
        }
      );

    return JsonResponse.success(
      {
        data: serialize(docs, UserRegisteredWorkoutsPopulateSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(UserRegisteredWorkoutsPopulateSerialization)
  @SwaggerSummary("Get a workout")
  @SwaggerDescription("Get a single workout from user registered workouts (workouts that the user had started)")
  get = async (req: userRequest, res: Response) => {
    const data = await this.userRegisteredWorkoutsService.findOneOrFail(
      { _id: req.params.id },
      {
        populateArray: [
          { path: "workout" },
          { path: "weeks.days.exercises" },
        ],
      }
    );
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), UserRegisteredWorkoutsPopulateSerialization),
      },
      res
    );
  };

  @SwaggerGet("/home/:userId")
  @SwaggerResponse(UserRegisteredWorkoutsPopulateUserSerialization)
  @SwaggerSummary("Get home page")
  @SwaggerDescription("Get the home page for the user")
  getHomePage = async (req: userRequest, res: Response) => {
    
    const data = await this.userRegisteredWorkoutsService.findOneOrFail(
      { user: req.params.userId },
      {
        populateArray: [
          { path: "workout" },
          { path: "weeks.days.exercises" },
          { path: "user" },
        ],
      }
    );
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), UserRegisteredWorkoutsPopulateUserSerialization),
      },
      res
    );
  };

  @SwaggerPost()
  @SwaggerResponse(UserRegisteredWorkoutsSerialization)
  @SwaggerRequest(createUserRegisteredWorkoutsSchema)
  @SwaggerSummary("Create workout")
  @SwaggerDescription("Create a new workout for the user")
  create = async (req: userRequest, res: Response) => {
    const data = await this.userRegisteredWorkoutsService.create(req.body);
    return JsonResponse.success(
      {
        status: 201,
        data: serialize(data.toJSON(), UserRegisteredWorkoutsSerialization),
      },
      res
    );
  };
}
