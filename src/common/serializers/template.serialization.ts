import { Expose } from "class-transformer";

export class TemplateSerialization {
    @Expose({ name: "_id" })
    id: string;

    @Expose()
    name: string;

    @Expose()
    user: string;

    @Expose()
    exercises: string[];
}
