import { FilterQuery, QueryWithHelpers } from "mongoose";
import { IUser, UserDocument, userModel } from "../models/user.model";
import { HttpError } from "src/lib/error-handling/http-error";

export abstract class BaseUsersService {
  async findOne(filterObject: FilterQuery<UserDocument>) {
    return userModel.findOne(filterObject);
  }

  async findOneOrFail(
    filterObject: FilterQuery<UserDocument>
  ): Promise<UserDocument> {
    try {
      const document = await this.findOne(filterObject);
      if (!document) throw new HttpError(404, "No Matching Result Found.");

      return document;
    } catch (err) {
      console.error(err);
      throw new HttpError(500, "Unexpected Error Happened.");
    }
  }

  async userExists(filterObject: FilterQuery<UserDocument>): Promise<boolean> {
    return (await this.findOne(filterObject)) !== null;
  }

  async create(createParams: IUser): Promise<UserDocument> {
    if (await this.userExists({ email: createParams.email }))
      throw new HttpError(409, "Email Already Exists.");

    const newUser = new userModel(createParams) as UserDocument;
    return newUser.save();
  }

  async get(filterObject: FilterQuery<UserDocument>): Promise<UserDocument> {
    const user: UserDocument = await userModel
      .findOne(filterObject)
      .select("-password");
    if (!user) throw new HttpError(404, "No Matching Result Found.");
    return user;
  }

  async list(filterObject: FilterQuery<UserDocument>): Promise<{
    docs: UserDocument[];
    count: number;
  }> {
    const users = (await userModel
      .find(filterObject)
      .select("-password")) as UserDocument[];
    const count = await userModel.countDocuments(filterObject);
    return { docs: users, count };
  }
}
