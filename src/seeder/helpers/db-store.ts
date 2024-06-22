import { IExerciseCSV } from './load-exercises-dataset';
import { IMealJson } from './load-meals-dataset';

export const dbStore: {
  dbConnected: boolean;
  excerisesDataset: IExerciseCSV[];
  musclesDataset: ({ name: IExerciseCSV['target'], image: IExerciseCSV["target_url"] })[];
  equipmentsDataset: ({ name: IExerciseCSV['equipment'], image: IExerciseCSV["equipment_url"] })[];
  mealsDataset: IMealJson[];
  ingredientsNames: string[];
} = {
  dbConnected: false,
  excerisesDataset: [],
  musclesDataset: [],
  equipmentsDataset: [],
  mealsDataset: [],
  ingredientsNames: [],
}
