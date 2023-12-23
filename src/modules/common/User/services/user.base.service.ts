import { userModel, } from '../models/user.model'


export class UserBaseService {
  static async find(filterObject) {
    try {
      const resultObject = await userModel.findOne(filterObject).lean();

      if (!resultObject)
        return {
          success: false,
          code: 404,
          error: "No Matching Result Found.",
        };

      return {
        success: true,
        code: 200,
        result: resultObject,
      };
    } catch (err) {
      console.log(`err.message`, err.message);
      return {
        success: false,
        code: 500,
        error: "Unexpected Error Happened.",
      };
    }
  }

  static async get(filterObject) {
    try {
      const resultObject = await userModel.findOne(filterObject).lean().select("-password");
      if (!resultObject)
        return {
          success: false,
          code: 404,
          error: "No Matching Result Found.",
        };
      return {
        success: true,
        code: 200,
        result: resultObject,
      };
    } catch (err) {
      console.log(`err.message`, err.message);
      return {
        success: false,
        code: 500,
        error: "Unexpected Error Happened.",
      };
    }
  }

  static async list(filterObject) {
    try {
      const resultArray = await userModel
        .find(filterObject)
        .lean()
        .select("-password");

      if (!resultArray)
        return {
          success: false,
          code: 404,
          error: "No Matching Result Found.",
        };
      const count = await userModel.countDocuments(filterObject);
      return {
        success: true,
        code: 200,
        result: resultArray,
        count,
      };
    } catch (err) {
      console.log(`err.message`, err.message);
      return {
        success: false,
        code: 500,
        error: "Unexpected Error Happened.",
      };
    }
  }

}



