import { connectDatabase } from "@configs/database";
import { dbStore } from "./db-store";

export const seederWrapper =
  (model, seederFunction: () => Promise<void>) => async () => {
    // get cli arguments
    const args = process.argv.slice(2);

    // check if reset flag is passed
    const resetFlag = args.includes("--reset");

    // connect to database
    if (!dbStore.dbConnected) {
      await connectDatabase();
      dbStore.dbConnected = true;
    }

    // clear the collection
    if (resetFlag) {
      console.log(`Clearing collection: ${model.collection.collectionName}`);
      await model.deleteMany({});
      console.log(`Collection ${model.collection.collectionName} cleared!`);
    }

    // run the seeder
    return seederFunction();
  };
