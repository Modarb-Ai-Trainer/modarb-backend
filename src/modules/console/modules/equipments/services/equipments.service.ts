import { Equipment } from "@common/models/equipment.model";
import { CrudService } from "@lib/services/crud.service";

export class EquipmentsService extends CrudService(Equipment) {};
