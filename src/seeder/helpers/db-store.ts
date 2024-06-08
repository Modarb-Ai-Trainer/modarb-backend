import { IExerciseCSV } from './load-exercises-dataset';
import { IMealJson } from './load-meals-dataset';

export const dbStore: {
  dbConnected: boolean;
  excerisesDataset: IExerciseCSV[];
  musclesDataset: IExerciseCSV['target'][];
  equipmentsDataset: IExerciseCSV['equipment'][];
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
