import { ExerciseType } from "@common/enums/exercise-type.enum";
import { Equipment } from "@common/models/equipment.model";
import { Exercise, IExercise } from "@common/models/exercise.model";
import { Muscle } from "@common/models/muscle.model";
import { dbStore } from "seeder/helpers/db-store";
import { IExerciseCSV } from "seeder/helpers/load-exercises-dataset";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";

export default seederWrapper(Exercise, async () => {
  console.log('preparing exercises data... (this may take a while)');
  const data = await Promise.all(dbStore.excerisesDataset.map(async function (e: IExerciseCSV) {
    return {
      name: e.name,
      category: "unknown",
      exerciseType: e.type,
      ...(
        e.type === ExerciseType.WEIGHT && 
        {
          reps: Math.floor(Math.random() * 10),
          sets: e.sets,
          duration: 0,
        } 
        ||
        {
          duration: Math.floor(Math.random() * 100),
        }
      ),
      expectedDurationRange: {
        min: Math.floor(Math.random() * 10),
        max: 10 + Math.floor(Math.random() * 10),
      },
      instructions: "Do this exercise",
      benefits: "You will get stronger",
      targetMuscles: {
        primary: (await Muscle.findOne({ name: e.target }).exec())._id,
        secondary: (await Muscle.findOne({ name: e.target }).exec())._id,
      },
      equipments: [(await Equipment.findOne({name: e.equipment}).exec())._id],
      coverImage: "https://placehold.co/600x400",
      media: {
        type: 'image',
        url: "https://placehold.co/600x400",
      }
    } satisfies IExercise;
  }))
  console.log('inserting exercises...');
  await Exercise.insertMany(data);
})
