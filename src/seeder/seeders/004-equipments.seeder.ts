import { Equipment } from "@common/models/equipment.model";
import { dbStore } from "seeder/helpers/db-store";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";

export default seederWrapper(Equipment, async () => { await Promise.all(dbStore.equipmentsDataset.map(async function (e) {
  return Equipment.create({ name: e.name, image: e.image, isDeleted: false})
}))
})
