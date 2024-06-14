import { UserRegisteredWorkoutsService } from "../services/user-registered-workouts.service";
import { Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { bodyValidator } from "@helpers/validation.helper";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { UserRegisteredWorkoutsSerialization } from "@common/serializers/user-registered-workout.serialization";
import { UserRegisteredWorkoutsPopulateSerialization } from "@common/serializers/user-registered-workoutPopulate.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { createUserRegisteredWorkoutsSchema } from "../validations/create-user-registered-workouts.validation";
import {
  SwaggerGet,
  SwaggerPatch,
  SwaggerPost,
} from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";import { updateUserRegisteredWorkoutsSchema } from "../validations/update-user-registered-workouts.validation";
import { IUserRequest } from "@common/interfaces/user-request.interface";
 4


@Controller("/user/myWorkouts")
@ControllerMiddleware(UsersGuardMiddleware())
export class userRegisteredWorkoutsController extends BaseController {
  private userRegisteredWorkoutsService = new UserRegisteredWorkoutsService();

  setRoutes(): void {
    this.router.get("/:id", asyncHandler(this.get));
    this.router.get("/", asyncHandler(this.list));
    this.router.post(
      "/",
      bodyValidator(createUserRegisteredWorkoutsSchema),
      asyncHandler(this.create)
    );
    this.router.patch(
      "/:id/progress/:week/:day",
      bodyValidator(updateUserRegisteredWorkoutsSchema),
      asyncHandler(this.updateProgress)
    );
  }

  @SwaggerGet()
  @SwaggerResponse([UserRegisteredWorkoutsPopulateSerialization])
  @SwaggerSummary("List my workouts")
  @SwaggerDescription("List all user registered workouts (workouts that the user had started)")
  list = async (req: IUserRequest, res: Response) => {
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
  @SwaggerSummary("today's workout && my trainer --> my plan && weekly")
  @SwaggerDescription("Get a single workout from user registered workouts (workouts that the user had started)")
  get = async (req: IUserRequest, res: Response) => {
    const data = await this.userRegisteredWorkoutsService.findOneOrFail(
      { _id: req.params.id },
      {
        populateArray: [
          { path: "workout", select: ["-weeks"] },
          { path: "weeks.days.exercises", populate: [
            { path: "targetMuscles.primary" },
            { path: "targetMuscles.secondary" },
            { path: "equipments" }
          ]}
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


  @SwaggerPost()
  @SwaggerResponse(UserRegisteredWorkoutsSerialization)
  @SwaggerRequest(createUserRegisteredWorkoutsSchema)
  @SwaggerSummary("Create workout")
  @SwaggerDescription("Create a new workout for the user")
  create = async (req: IUserRequest, res: Response) => {
    const data = await this.userRegisteredWorkoutsService.createForUser(req.body, req.jwtPayload.id);
    return JsonResponse.success(
      {
        status: 201,
        data: serialize(data.toJSON(), UserRegisteredWorkoutsSerialization),
      },
      res
    );
  };

  @SwaggerPatch('/:id/progress/:week/:day')
  @SwaggerResponse({})
  @SwaggerRequest(updateUserRegisteredWorkoutsSchema)
  @SwaggerSummary("Update Workout Progress")
  @SwaggerDescription("Update the progress of a workout")
  updateProgress = async (req: IUserRequest, res: Response) => {
    const urwId: string = req.params.id;
    const weekNumber: number = Number(req.params.week);
    const dayNumber: number = Number(req.params.day);
    await this.userRegisteredWorkoutsService.updateForUser({
      urwId, weekNumber, dayNumber
    }, req.body, req.jwtPayload.id);
    return JsonResponse.success(
      {
        message: "Workout updated successfully",
      },
      res
    );
  };
}
