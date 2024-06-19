import { Template } from "@common/models/template.model";
import { HttpError } from "@lib/error-handling/http-error";
import { CrudService } from "@lib/services/crud.service";


export class TemplateService extends CrudService(Template) {

    async createForUser(createParams: any) {

        let template = await this.model.findOne({ name: createParams.name, user: createParams.user});
        if (template) {
          throw new HttpError(400, "template already exists");
        }
        return this.model.create(createParams);
      }
}
