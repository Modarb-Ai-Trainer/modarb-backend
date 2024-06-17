import bcrypt from "bcrypt";
import { ILogin } from "../validation/login.validation";
import { HttpError } from "@lib/error-handling/http-error";
import { JwtHelper } from "@helpers/jwt.helper";
import { User } from "@common/models/user.model";
import { IUserRegister } from "@common/validations/user-register.validation";
import { CrudService } from "@lib/services/crud.service";
import { WorkoutService } from "../../workouts/services/workouts.service";
import { MealPlansService } from "../../meal-plans/services/meal-plans.service";

export class UsersAuthService extends CrudService(User) {
  private workoutsService = new WorkoutService();
  private mealPlanService = new MealPlansService();

  async register(createParams: IUserRegister) {
    if (createParams.password !== createParams.confirmPassword) {
      throw new HttpError(400, "passwords do not match");
    }
    const user = await this.create(createParams);
    await this.workoutsService.createModelWorkout(user);
    await this.mealPlanService.createModelMealPlan(user);
    return user;
  }

  async login(loginRequest: ILogin) {
    const user = await this.findOne({ email: loginRequest.email });
    if (!user) throw new HttpError(401, "Invalid Credentials");

    const isPasswordCorrect = await bcrypt.compare(
      loginRequest.password,
      user.password
    );
    if (!isPasswordCorrect) throw new HttpError(401, "Invalid Credentials");
    const token = JwtHelper.generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      type: "user",
    });
    return { user, token };
  }
}
