import { Admin } from "../../../common/models/admin.model";
import { CrudService } from "@lib/services/crud.service";

export class AdminsService extends CrudService(Admin) {}
