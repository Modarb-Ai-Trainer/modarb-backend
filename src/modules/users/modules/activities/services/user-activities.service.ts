import { Activity } from "@common/models/activity.model";
import { CrudService } from "@lib/services/crud.service";

export class UserActivitiesService extends CrudService(Activity) {}
