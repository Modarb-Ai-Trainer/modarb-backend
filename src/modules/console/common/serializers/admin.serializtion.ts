import { Expose, Transform } from "class-transformer";

export class AdminSerialization {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  image: object;

  @Expose()
  role: string;

  @Expose()
  gender: string;

  @Expose({ name: "dob" })
  @Transform(
    ({ value }) => new Date().getFullYear() - (value as Date).getFullYear()
  )
  age: number;
}