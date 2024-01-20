import bcrypt from "bcrypt";
import { Admin, IAdmin } from "../models/admin.model";
import { config } from "../../../../configs/config";
import { FilterQuery } from "mongoose";

export class AdminsService {
  async find(filterObject) {
    try {
      const resultObject = await Admin.findOne(filterObject).lean();

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
        error: "Unexpected Error Happened.",
      };
    }
  }

  async get(filterObject: FilterQuery<IAdmin>) {
    try {
      const resultObject = await Admin.findOne(filterObject)
        .lean()
        .select("-password");
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
        error: "Unexpected Error Happened.",
      };
    }
  }

  async list(filterObject) {
    try {
      const resultArray = await Admin.find(filterObject)
        .lean()
        .select("-password");

      if (!resultArray)
        return {
          success: false,
          code: 404,
          error: "No Matching Result Found.",
        };
      const count = await Admin.countDocuments(filterObject);
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

  async create(formObject) {
    try {
      if (formObject.email) formObject.email = formObject.email.toLowerCase();
      const resultObject = new Admin(formObject);
      await resultObject.save();

      if (!resultObject)
        return {
          success: false,
          code: 500,
          error: "Unexpected Error Happened.",
        };

      return {
        success: true,
        code: 201,
        record: resultObject,
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

  async update(_id, formObject) {
    try {
      const existingObject = await this.find({ _id });
      if (!existingObject.success)
        return {
          success: false,
          code: 404,
          error: "No Matching Result Found.",
        };
      if (formObject.email) {
        formObject.email = formObject.email.toLowerCase();
        const duplicate = await this.find({ email: formObject.email });
        if (
          duplicate.success &&
          duplicate.record._id.toString() !=
            existingObject.record._id.toString()
        )
          return {
            success: false,
            error: "This Email is taken by another user",
            code: 409,
          };
      }

      const resultObject = await Admin.findByIdAndUpdate({ _id }, formObject);

      if (!resultObject)
        return {
          success: false,
          code: 500,
          error: "Unexpected Error Happened.",
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
        error: "Unexpected Error Happened.",
      };
    }
  }

  async remove(_id) {
    try {
      const resultObject = await Admin.findByIdAndDelete({ _id });
      if (!resultObject)
        return {
          success: false,
          code: 404,
          error: "No Matching Result Found.",
        };

      return {
        success: true,
        code: 200,
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

  async comparePassword(emailString, passwordString) {
    try {
      emailString = emailString.toLowerCase();
      const existingObject = await this.find({ email: emailString });

      if (!existingObject.success)
        return {
          success: false,
          code: 404,
          error: "No Matching Result Found.",
        };

      const matchingPasswords = await bcrypt.compare(
        passwordString,
        existingObject.record.password
      );
      if (!matchingPasswords)
        return {
          success: false,
          code: 409,
          error: "Incorrect Password.",
        };

      return {
        success: true,
        record: existingObject.record,
        code: 200,
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

  async resetPassword(emailString, newPasswordString) {
    try {
      emailString = emailString.toLowerCase();
      const existingObject = await this.find({ email: emailString });

      if (!existingObject.success)
        return {
          success: false,
          code: 404,
          error: "No Matching Result Found.",
        };

      const hashedPassword = await bcrypt.hash(
        newPasswordString,
        config.saltRounds
      );
      const resultObject = await Admin.findOneAndUpdate(
        { email: emailString },
        { password: hashedPassword }
      );

      if (!resultObject)
        return {
          success: false,
          code: 500,
          error: "Unexpected Error Happened.",
        };

      return {
        success: true,
        code: 200,
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
