import { IExerciseCSV } from './load-exercises-dataset';

export const dbStore: {
  dbConnected: boolean;
  excerisesDataset: IExerciseCSV[];
  musclesDataset: IExerciseCSV['target'][];
  equipmentsDataset: IExerciseCSV['equipment'][];
} = {
  dbConnected: false,
  excerisesDataset: [],
  musclesDataset: [],
  equipmentsDataset: [],
}
