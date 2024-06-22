import { ExerciseType } from "@common/enums/exercise-type.enum";
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { FitnessLevel } from "@common/enums/fitness-level.enum";
import { Gender } from "@common/enums/gender.enum";
import { config } from "@configs/config";

const endpoint = '/fitness';

export interface IFitnessPredictionItem {
  bodyPart: string;
  equipment: string;
  name: string;
  repetitions: number;
  sets: number;
  target: string;
  type: string;
  weights_or_duration: number;
}

// Fitness Workout Params
export interface IFWParams {
  home_or_gym: 0 | 1; // 0 for home, 1 for gym
  level: FitnessLevel;
  goal: FitnessGoal;
  gender: Gender;
  age: number;
  feedback: boolean;
  old_weight: number;
  equipments: string[];
}

export class FitnessModel {
  public static async predictWorkout(
    params: IFWParams
  ): Promise<IFitnessPredictionItem[][]> {
    params.level = params.level.split(' ').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') as FitnessLevel;
    params.goal = params.goal.split(' ').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') as FitnessGoal;
    params.gender = params.gender.toUpperCase() as Gender;

    const response = await fetch(
      `${config.modelsServerUrl}${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      console.error(await response.text());
      throw new Error("Failed to fetch data from the server");
    }

    return response.text().then((data) => {
      data = data.replace('NaN', ExerciseType.DURATION.toString()).replace('\n', '')
      return JSON.parse(data)
    });
  }
}
