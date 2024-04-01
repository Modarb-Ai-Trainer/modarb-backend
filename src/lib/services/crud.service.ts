import { HttpError } from "@lib/error-handling/http-error";
import { populate } from "dotenv";
import { AnyKeys, Document, FilterQuery, Model } from "mongoose";

export const CrudService = <ModelDoc extends Document>(
  model: Model<ModelDoc>
) => {
  return class CrudServiceClass {
    protected model: Model<ModelDoc> = model;

    async create(data: AnyKeys<ModelDoc>): Promise<ModelDoc> {
      return this.model.create(data);
    }

    async updateOne(
      filter: FilterQuery<ModelDoc>,
      data: AnyKeys<ModelDoc>
    ): Promise<ModelDoc> {
      await this.existsOrThrow(filter);
      await this.model.updateOne(filter, data);
      return this.findOneOrFail(filter);
    }

    async updateMany(
      filter: FilterQuery<ModelDoc>,
      data: AnyKeys<ModelDoc>
    ): Promise<ModelDoc[]> {
      await this.existsOrThrow(filter);
      await this.model.updateMany(filter, data);
      return this.model.find(filter);
    }

    async deleteOne(filter: FilterQuery<ModelDoc>): Promise<ModelDoc> {
      await this.existsOrThrow(filter);
      return this.model.findOneAndDelete(filter);
    }

    async list(
      filter: FilterQuery<ModelDoc>,
      paginationOptions: {
        limit?: number;
        skip?: number;
      } = {
          limit: 10,
          skip: 0,
        },
      options?: {
        populateObject: any
      }
    ): Promise<{
      docs: ModelDoc[];
      paginationData: {
        total: number;
        page: number;
        perPage: number;
      };
    }> {
      const queryInstruction = this.model
        .find(filter)
        .limit(paginationOptions.limit)
        .skip(paginationOptions.skip)
      if (options?.populateObject) queryInstruction.populate(options.populateObject);

      const docs = await queryInstruction
      const total = await this.model.countDocuments(filter);
      const paginationData = {
        total: total,
        page: paginationOptions.skip,
        perPage: paginationOptions.limit,
      };

      return { docs, paginationData };
    }

    async findOne(filter: FilterQuery<ModelDoc>): Promise<ModelDoc | null> {
      return this.model.findOne(filter);
    }

    async findOneOrFail(filter: FilterQuery<ModelDoc>): Promise<ModelDoc> {
      await this.existsOrThrow(filter);
      const document = await this.findOne(filter);

      return document;
    }

    private async existsOrThrow(filter: FilterQuery<ModelDoc>) {
      if (!(await this.model.exists(filter))) {
        throw new HttpError(404, "No Matching Result Found.");
      }
    }
  };
};
