import { User, UserDocument } from "@common/models/user.model";
import { HttpError } from "@lib/error-handling/http-error";
import { CrudService } from "@lib/services/crud.service";
import { AnyKeys } from "mongoose";

export class UsersService extends CrudService(User) {
    create(data: any): Promise<UserDocument> {
        if(data.password !== data.confirmPassword) {
            throw new HttpError(400, "passwords do not match");
        }
        return super.create(data);
    }
}
