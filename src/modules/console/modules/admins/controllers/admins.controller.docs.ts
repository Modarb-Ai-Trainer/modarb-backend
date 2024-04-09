import { AdminSerialization } from "modules/console/common/serializers/admin.serialization";
import { Tspec } from "tspec";
import { ICreateAdmin } from "../validations/create-admin.validation";
import { AdminsController } from "./admins.controller";

export type AdminsControllerSpecs = Tspec.DefineApiSpec<{
  basePath: "/api/v1/console/admins";
  tags: ["console/admins"];
  paths: {
    "/": {
      get: {
        handler: AdminsController["list"];
      };
      post: {
        body: ICreateAdmin;
        handler: AdminsController["create"];
      };
    };
    "/{id}": {
      get: {
        path: {
          id: string;
        };
        handler: AdminsController["get"];
      };
      patch: {
        path: {
          id: string;
        };
        body: ICreateAdmin;
        handler: AdminsController["update"];
      };
      delete: {
        path: {
          id: string;
        };
        handler: AdminsController["delete"];
      };
    };
  }
}>;
