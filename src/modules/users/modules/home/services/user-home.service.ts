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
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { MealsService } from "../../meals/services/meals.service";
import { calcAge } from "@lib/utils/age";

export class UserHomeService {
  private userService = new UserService();
  private activitiesService = new UserActivitiesService();
  private exercisesService = new ExerciseService();
  private mealsService = new MealsService();

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

  async getHomePageYourDailyIntake(userId: string): Promise<UserHomeYourDailyIntakeSerialization>{
    const user = await this.userService.findOneOrFail({_id: new Types.ObjectId(userId)});
    const goalToCalsMap = {}
    const goalToCarbsMap = {}
    const goalToProteinMap = {}
    const goalToFatMap = {}
    goalToCalsMap[FitnessGoal.GET_FITTER] = 2000;
    goalToCalsMap[FitnessGoal.LOSE_WEIGHT] = 1500;
    goalToCalsMap[FitnessGoal.GAIN_MUSCLE] = 2500;
    goalToCarbsMap[FitnessGoal.GET_FITTER] = 50;
    goalToCarbsMap[FitnessGoal.LOSE_WEIGHT] = 30;
    goalToCarbsMap[FitnessGoal.GAIN_MUSCLE] = 60;
    goalToProteinMap[FitnessGoal.GET_FITTER] = 30;
    goalToProteinMap[FitnessGoal.LOSE_WEIGHT] = 40;
    goalToProteinMap[FitnessGoal.GAIN_MUSCLE] = 50;
    goalToFatMap[FitnessGoal.GET_FITTER] = 20;
    goalToFatMap[FitnessGoal.LOSE_WEIGHT] = 30;
    goalToFatMap[FitnessGoal.GAIN_MUSCLE] = 20;

    const caloriesGoal = goalToCalsMap[user.preferences?.fitness_goal] || 2000;

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

    const todaysMealsActivities = await this.activitiesService.model.find({
      user_id: new Types.ObjectId(userId),
      activity_type: ActivityType.MEAL,
      $and: [
        { created_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        { created_at: { $lte: new Date(new Date().setHours(23, 59, 59, 999)) } },
      ],
    });
    const todaysMealsIds = todaysMealsActivities.map(a => a.related_id);

    const todaysMeals = await this.mealsService.model.find({
      _id: { $in: todaysMealsIds },
    });

    const caloriesBurned = todaysExercises.reduce((acc, curr) => acc + this.exercisesService.calculateCalories(curr), 0);
    const caloriesLeft = caloriesGoal - caloriesBurned;
    const caloriesIntake = todaysMeals.reduce((acc, curr) => acc + curr.calories, 0);

    const carbsGoal = goalToCarbsMap[user.preferences?.fitness_goal] || 50;
    const carbsConsumed = todaysMeals.reduce((acc, curr) => acc + curr.carbs, 0);

    const proteinGoal = goalToProteinMap[user.preferences?.fitness_goal] || 30;
    const proteinConsumed = todaysMeals.reduce((acc, curr) => acc + curr.proteins, 0);

    const fatGoal = goalToFatMap[user.preferences?.fitness_goal] || 20;
    const fatConsumed = todaysMeals.reduce((acc, curr) => acc + curr.fats, 0);

    return {
      caloriesGoal,
      caloriesLeft,
      caloriesBurned,
      caloriesIntake,
      carbsGoal,
      carbsConsumed,
      proteinGoal,
      proteinConsumed,
      fatGoal,
      fatConsumed,
    }
  }

  async getHomePageStreak(userId: string, startDate: Date, endDate: Date): Promise<HomeStreakSerialization> {
    // list day names in between the start and end date
    //
    const activities = await this.activitiesService.model.find({
      user_id: new Types.ObjectId(userId),
      $and: [
        { created_at: { $gte: startDate } },
        { created_at: { $lte: endDate } },
      ],
    });
    const days = this.getDaysArray(startDate, endDate);

    return {
      days: days.map(day => ({
        day: day,
        points: activities.filter(a => a.created_at.toLocaleString('en-US', { weekday: 'long' }).toLowerCase() === day).length,
      })),
    }
  }

  async getNutriHomeDailyGoals(userId: string): Promise<UserNutriHomeDailyGoalsSerialization> {
    const user = await this.userService.findOneOrFail({_id: new Types.ObjectId(userId)});
    const sleepGoal = calcAge(user.dob) < 18 ? 8 : 7;
    const sleepDone = Math.round(sleepGoal * 0.8);

    return {
      ...(await this.getDailyGoals(userId)),
      sleepGoal,
      sleepDone,
    }
  }
}
