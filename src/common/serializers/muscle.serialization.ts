import { Expose } from "class-transformer";

export class EquipmentSerialization {
    @Expose({ name: "_id" })
    id: string;

    @Expose()
    name: string;

    @Expose()
    image: string;
}
