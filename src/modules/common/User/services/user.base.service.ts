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
        record: resultObject,
      };
    } catch (err) {
      console.log(`err.message`, err.message);
      return {
        success: false,
        code: 500,
        error: err.message,
      };
    }
  }

  static async create(form: any) {
    try {
        if (form.email) {
            form.email = form.email.toLowerCase()
            let user = await this.find({ email: form.email });
            if (user.success) return { success: false, error: "This email already exists", code: 409 };
        }
        let newUser = new userModel(form);
        await newUser.save();
        return {
            success: true,
            code: 201
        };

    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: err.message
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
        record: resultObject,
      };
    } catch (err) {
      console.log(`err.message`, err.message);
      return {
        success: false,
        code: 500,
        error: err.message,
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
        record: resultArray,
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



