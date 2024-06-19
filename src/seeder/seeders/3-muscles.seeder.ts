import { Muscle } from "@common/models/muscle.model";
import { dbStore } from "seeder/helpers/db-store";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";

export default seederWrapper(Muscle, async () => {
  await Promise.all(dbStore.musclesDataset.map(async function (m) {
    return Muscle.create({ name: m, image: `https://placehold.co/600x400`, isDeleted: false})
  }))
})
