import { Role } from "@common/enums/role.enum";
import { Admin } from "modules/console/common/models/admin.model";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";

export default seederWrapper(Admin, async () => {
  // create super admin
  await Admin.create({
    email: "super@app.com",
    password: "super",
    role: Role.SUPER_ADMIN,
    gender: "M1 Abrams Tank",
    name: "Super Admin",
    dob: new Date(),
  });
});
