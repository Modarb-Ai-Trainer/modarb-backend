import { UsersBaseService } from "../../../common/users/services/users.base.service";
import bcrypt from "bcrypt";

export class UsersService extends UsersBaseService {
  async comparePassword(email: string, password: string) {
    try {
      if (email != undefined) {
        email = email.toLowerCase();
      }
      let result = await this.find({ email });
      if (!result.success) return result;

      let match = await bcrypt.compare(password, result.record.password);
      delete result.record.password;

      if (!match)
        return {
          success: false,
          code: 409,
          message: "password isn't correct",
        };

      return {
        success: true,
        code: 200,
        record: result.record,
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

  // async resetPassword(_id: any, currentPassword: string, newPassword: string, confirmPassword: string) {
  //     try {
  //         let user = await UserBaseService.find({ _id })
  //         let saltrouds = 5;
  //         let oldPassword = user.record.password;
  //         let ok = await bcrypt.compare(currentPassword, oldPassword)

  //         if (user.success) {

  //             if (!ok) return {
  //                 success: false,
  //                 code: 409,
  //                 message: "current password isn't correct"
  //             };

  //             if (newPassword == currentPassword) return {
  //                 success: false,
  //                 code: 409,
  //                 message: "new password must be different from current password"
  //             };

  //             if (newPassword != confirmPassword) return {
  //                 success: false,
  //                 code: 409,
  //                 message: "passwords don't match"
  //             };

  //             const hashedPassword = await bcrypt.hash(newPassword, saltrouds)
  //             await userModel.findByIdAndUpdate(_id, { password: hashedPassword })
  //             return {
  //                 success: true,
  //                 code: 200,
  //                 message: "password changed successfully"
  //             };
  //         }
  //         else return {
  //             success: false,
  //             code: 404,
  //             error: user.error
  //         };
  //     } catch (err) {
  //         console.log(`err.message`, err.message);
  //         return {
  //             success: false,
  //             code: 500,
  //             error: err.message
  //         };
  //     }
  // }
}
