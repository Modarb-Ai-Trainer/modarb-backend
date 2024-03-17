import { User } from "@common/models/user.model";
import { CrudService } from "@lib/services/crud.service";

export class UsersService extends CrudService(User) {}
