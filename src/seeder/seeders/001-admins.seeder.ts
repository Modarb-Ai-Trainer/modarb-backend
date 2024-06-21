import { Role } from "@common/enums/role.enum";
import { Admin } from "modules/console/common/models/admin.model";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";

export default seederWrapper(Admin, async () => {
  // create super admin
  await Admin.create({
    name: "Super Admin",
    email: "super@app.com",
    password: "super",
    image: `https://placehold.co/300x400`,
    gender: "M1 Abrams Tank",
    role: Role.SUPER_ADMIN,
  });
});
