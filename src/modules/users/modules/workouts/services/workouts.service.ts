import { WorkoutPlace } from "@common/enums/workout-place.enum";
import { UserDocument } from "@common/models/user.model";
import { Workout } from "@common/models/workout.model";
import { FitnessModel, IFWParams, IFitnessPredictionItem } from "@lib/models/fitness-model";
import { CrudService } from "@lib/services/crud.service";
import { calcAge } from "@lib/utils/age";
import { ExerciseService } from "../../exercises/services/exercises.service";
import { UserRegisteredWorkoutsService } from "../../user-registered-workouts/services/user-registered-workouts.service";

export class WorkoutService extends CrudService(Workout, {
  defaultFilter: {
    aiGenerated: false,
  },
}) {
  private exerciseService = new ExerciseService();
  private userRegisteredWorkoutsService = new UserRegisteredWorkoutsService();

  public async createModelWorkout(user: UserDocument) {
    const params: IFWParams = {
      home_or_gym: user.preferences.workout_place === WorkoutPlace.GYM ? 1 : 0,
      level: user.fitness_level,
      goal: user.preferences.fitness_goal,
      gender: user.gender,
      age: calcAge(user.dob),
      feedback: false,
      old_weight: user.weight,
      equipments: user.preferences.preferred_equipment,
    };

    const pworkout = await FitnessModel.predictWorkout(params);

    // partition the workout days into weeks
    // each week has 7 days
    const weeks: IFitnessPredictionItem[][][] = [];
    for (let i = 0; i < pworkout.length; i += 7) {
      weeks.push(pworkout.slice(i, i + 7));
    }

    const exercisesNames = pworkout.flat().map((e) => e.name);
    const exercises = await this.exerciseService.listAll({ name: { $in: exercisesNames } });

    const workout = await this.create({
      aiGenerated: true,
      name: `AI Generated Workout for ${user.name} (${new Date().toLocaleDateString()})`,
      description: `AI Generated Workout for ${user.name} (${new Date().toLocaleDateString()})`,
      type: "AI Generated",
      created_by: user._id,
      image: "https://placehold.co/300x400",
      fitness_level: user.fitness_level,
      fitness_goal: user.preferences.fitness_goal,
      place: [user.preferences.workout_place],
      min_per_day: 30,
      total_number_days: pworkout.flat().length,
      template_weeks: weeks.map((week, i) => ({
        week_number: i + 1,
        week_name: `Week ${i + 1}`,
        week_description: `Week ${i + 1}`,
        days: week.map((day, j) => ({
          day_number: j + 1,
          total_number_exercises: day.length,
          day_type: "full_body", // #TODO: Change this
          exercises: day.map((e) => exercises.find((ex) => ex.name === e.name)?._id),
        })),
      })),
    });

    await this.userRegisteredWorkoutsService.createForUser({
      workout: workout._id,
    }, user._id);
  }
}
