import { HomeStreakSerialization } from "../responses/home-streak.serialization";
import { faker } from '@faker-js/faker';
import { UserHomeYourDailyIntakeSerialization } from "../responses/user-home-your-daily-intake.serialization";
import { UserHomeDailyGoalsSerialization } from "../responses/user-home-daily-goals.serialization";
import { UserNutriHomeDailyGoalsSerialization } from "../responses/user-nutri-home-daily-goals.serialization";
import { UserService } from "../../users/services/users.service";
import { Types } from "mongoose";
import { UserActivitiesService } from "../../activities/services/user-activities.service";
import { ActivityType } from "@common/enums/activity-type.enum";
import { ExerciseService } from "../../exercises/services/exercises.service";

export class UserHomeService {
  private userService = new UserService();
  private activitiesService = new UserActivitiesService();
  private exercisesService = new ExerciseService();

  private getDaysArray(startDate: Date, endDate: Date): string[] {
    const days = [];
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      days.push(day.toLocaleString('en-US', { weekday: 'long' }).toLowerCase());
    }
    return days;
  }

  async getDailyGoals(userId: string): Promise<UserHomeDailyGoalsSerialization> {
    const user = await this.userService.findOneOrFail({_id: new Types.ObjectId(userId)});
    const todaysExerciseActivities = await this.activitiesService.model.find({
      user_id: new Types.ObjectId(userId),
      activity_type: ActivityType.EXERCISE,
      $and: [
        { created_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        { created_at: { $lte: new Date(new Date().setHours(23, 59, 59, 999)) } },
      ],
    });
    const todaysExercisesIds = todaysExerciseActivities.map(a => a.related_id);
    
    const todaysExercises = await this.exercisesService.model.find({
      _id: { $in: todaysExercisesIds },
    });

    const waterGoal = (user.weight || 1) * 2;
    const waterConsumed = Math.round(waterGoal * 0.72);

    const stepsGoal = (user.height || 1) * 100;
    const stepsDone = Math.round(stepsGoal * 0.78);

    const exercisesCals = todaysExercises.reduce((acc, curr) => acc + this.exercisesService.calculateCalories(curr), 0);
    const exercisesHours = todaysExercises.reduce((acc, curr) => acc + curr.duration || curr.expectedDurationRange?.min || 0, 0) /60;

    return {
      waterGoal,
      waterConsumed,
      stepsGoal,
      stepsDone,
      exercisesCals,
      exercisesHours
    }
  }

  async getHomePageYourDailyIntake(_userId: string): Promise<UserHomeYourDailyIntakeSerialization>{
    const caloriesGoal = faker.number.int({ min: 29, max: 100 });
    const caloriesLeft = faker.number.int({ min: 0, max: caloriesGoal});
    const caloriesBurned = caloriesGoal - caloriesLeft;

    const carbsGoal = faker.number.int({ min: 29, max: 100 });
    const carbsConsumed = faker.number.int({ min: 0, max: carbsGoal });

    const proteinGoal = faker.number.int({ min: 29, max: 100 });
    const proteinConsumed = faker.number.int({ min: 0, max: proteinGoal });

    const fatGoal = faker.number.int({ min: 29, max: 100 });
    const fatConsumed = faker.number.int({ min: 0, max: fatGoal });

    return {
      caloriesGoal,
      caloriesLeft,
      caloriesBurned,
      carbsGoal,
      carbsConsumed,
      proteinGoal,
      proteinConsumed,
      fatGoal,
      fatConsumed,
    }
  }

  async getHomePageStreak(_userId: string, startDate: Date, endDate: Date): Promise<HomeStreakSerialization> {
    // list day names in between the start and end date
    const days = this.getDaysArray(startDate, endDate);

    return {
      days: days.map(day => ({
        day: day,
        points: faker.number.int({ min: 0, max: 100 }),
      })),
    }
  }

  async getNutriHomeDailyGoals(userId: string): Promise<UserNutriHomeDailyGoalsSerialization> {
    const sleepGoal = faker.number.int({ min:29, max: 100 })
    const sleepDone = faker.number.int({ min:0, max: sleepGoal })

    return {
      ...(await this.getDailyGoals(userId)),
      sleepGoal,
      sleepDone,
    }
  }
}
