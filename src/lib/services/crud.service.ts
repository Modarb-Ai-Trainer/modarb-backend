import { HttpError } from "@lib/error-handling/http-error";
import { AnyKeys, Document, FilterQuery, Model } from "mongoose";

export const CrudService = <ModelDoc extends Document>(
  model: Model<ModelDoc>
) => {
  return class CrudServiceClass {
    protected model: Model<ModelDoc> = model;

    async create(data: AnyKeys<ModelDoc>): Promise<ModelDoc> {
      return this.model.create(data);
    }

    async update(
      filter: FilterQuery<ModelDoc>,
      data: AnyKeys<ModelDoc>
    ): Promise<ModelDoc> {
      return this.model.findOneAndUpdate(filter, data, { new: true });
    }

    async delete(filter: FilterQuery<ModelDoc>): Promise<ModelDoc> {
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
      }
    ): Promise<{
      docs: ModelDoc[];
      paginationData: {
        total: number;
        page: number;
        perPage: number;
      };
    }> {
      const docs = await this.model
        .find(filter)
        .limit(paginationOptions.limit)
        .skip(paginationOptions.skip);

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
      const document = await this.findOne(filter);
      if (!document) throw new HttpError(404, "No Matching Result Found.");

      return document;
    }
  };
};
