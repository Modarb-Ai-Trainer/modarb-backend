import { ExerciseType } from "@common/enums/exercise-type.enum";
import * as path from "path";
const csv = require('csv-parser')
const fs = require('fs')

type EBodyPart = "waist" | "upper legs" | "upper arms" | "lower legs" | "chest" | "lower arms" | "back" | "neck" | "shoulders" | "cardio";
type EType = ExerciseType;
type EGoal = "Gain Muscle" | "Get Fitter & Lose Weight";
type ELevel = "Beginner" | "Intermediate" | "Advanced";
type EEquipment = "band" | "barbell" | "kettlebell" | "dumbbell" | "weighted" | "cable" | "Machine" | "body weight" | "medicine ball" | "Exercise Ball" | "Foam Roll" | "ez barbell" | "leverage machine" | "assisted" | "rope" | "sled machine" | "upper body ergometer" | "olympic barbell" | "bosu ball" | "skierg machine" | "hammer" | "smith machine" | "wheel roller" | "stationary bike" | "tire" | "trap bar" | "elliptical machine" | "stepmill machine";
type ETarget = "abs" | "adductors" | "abductors" | "biceps" | "calves" | "pectorals" | "forearms" | "glutes" | "hamstrings" | "lats" | "Lower Back" | "Middle Back" | "traps" | "levator scapulae" | "quads" | "delts" | "triceps" | "cardiovascular system" | "spine" | "upper back" | "serratus anterior";

export interface IExerciseCSV {
    name: string;
    target: ETarget;
    equipment: EEquipment;
    level: ELevel;
    gym: boolean;
    home: boolean;
    goal: EGoal;
    bodyPart: EBodyPart;
    type: EType;
    sets: number;
    instructions: string;
}


const filePath = path.join(__dirname, '../../resources/exercises.csv');

export const loadExercisesDataset = async (): Promise<IExerciseCSV[]> => {
  let results: IExerciseCSV[] = [];

  await new Promise((resolve) => {
    fs
    .createReadStream(filePath)
    .pipe(csv())
    .on('data', (data: any) => {
      // skip empty rows
      if (Object.values(data).some((v: any) => !v)) {
        return;
      }
      if(!data.type){
        console.log("type is null", data);
      }

      results.push({
        ...data,
        gym: data.gym == '1',
        home: data.home == '1',
        sets: parseInt(data.sets)
      })
    })
    .on('end', () => {
      resolve(results);
    });
  });

  // remove duplicates by name
  const uniqueNames = new Set(results.map(e => e.name));
  results = results.filter(e => {
    const found = uniqueNames.has(e.name)
    uniqueNames.delete(e.name);
    return found;
  });

  console.log(`Loaded ${results.length} exercises from dataset`);

  return results;
}
