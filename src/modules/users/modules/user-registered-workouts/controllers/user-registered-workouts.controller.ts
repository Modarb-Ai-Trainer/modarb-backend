import { UserRegisteredWorkoutsService } from "../services/user-registered-workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { UserRegisteredWorkoutsSerialization } from "@common/serializers/user-registered-workout.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { createUserRegisteredWorkoutsSchema } from "../validations/create-user-registered-workouts.validation";
import { updateUserRegisteredWorkoutsSchema } from "../validations/update-user-registered-workouts.validation";
import {
  SwaggerGet,
  SwaggerPost,
} from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";

interface userRequest extends Request {
  jwtPayload?: any;
}

@Controller("/user/myWorkouts")
@ControllerMiddleware(UsersGuardMiddleware())
export class userRegisteredWorkoutsController extends BaseController {
  private userRegisteredWorkoutsService = new UserRegisteredWorkoutsService();

  setRoutes(): void {
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    this.router.get("/home/:userId", paramsValidator("userId"), asyncHandler(this.getHomePage));
    this.router.get("/", asyncHandler(this.list));
    this.router.post(
      "/",
      bodyValidator(createUserRegisteredWorkoutsSchema),
      asyncHandler(this.create)
    );
  }

  @SwaggerGet()
  @SwaggerResponse([UserRegisteredWorkoutsSerialization])
  list = async (req: userRequest, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.userRegisteredWorkoutsService.list(
      { user: req.jwtPayload.id, is_active: true },
      paginationQuery,
      {
        populateArray: [
          { path: "workout", select: "-templateWeeks -created_by" },
          { path: "weeks.days.exercises", select: "name media reps sets" },
        ]
      }
    );

    return JsonResponse.success(
      {
        data: serialize(docs, UserRegisteredWorkoutsSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(UserRegisteredWorkoutsSerialization)
  get = async (req: userRequest, res: Response) => {
    const data = await this.userRegisteredWorkoutsService.findOneOrFail(
      { _id: req.params.id },
      {
        populateArray: [
          { path: "workout", select: "-template_weeks -created_by" },
          { path: "weeks.days.exercises", select: "name media reps sets" },
        ]
      }
    );
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), UserRegisteredWorkoutsSerialization),
      },
      res
    );
  };

  getHomePage = async (req: userRequest, res: Response) => {
    const data = await this.userRegisteredWorkoutsService.findOneOrFail(
      { user: req.params.userId },
      {
        populateArray: [
          { path: "workout", select: "-template_weeks -created_by" },
          { path: "weeks.days.exercises", select: "name media reps sets" },
          { path: "user", select: "name preferences" }
        ]
      }
    );
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), UserRegisteredWorkoutsSerialization),
      },
      res
    );
  };

  @SwaggerPost()
  @SwaggerResponse(UserRegisteredWorkoutsSerialization)
  @SwaggerRequest(createUserRegisteredWorkoutsSchema)
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
