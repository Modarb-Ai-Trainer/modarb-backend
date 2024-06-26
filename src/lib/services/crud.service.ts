import { HttpError } from "@lib/error-handling/http-error";
import { AnyKeys, Document, FilterQuery, Model } from "mongoose";


export const CrudService = <ModelDoc extends Document>(
  model: Model<ModelDoc>,
  crudOptions?: {
    defaultFilter?: FilterQuery<ModelDoc>;
  }
) => {
  return class CrudServiceClass {
    public model: Model<ModelDoc> = model;

    async create(data: AnyKeys<ModelDoc>): Promise<ModelDoc> {
      return this.model.create(data);
    }

    async updateOne(
      filter: FilterQuery<ModelDoc>,
      data: AnyKeys<ModelDoc>
    ): Promise<ModelDoc> {
      filter = { ...crudOptions?.defaultFilter, ...filter };
      await this.existsOrThrow(filter);
      await this.model.updateOne(filter, data);
      return this.findOneOrFail(filter);
    }

    async updateMany(
      filter: FilterQuery<ModelDoc>,
      data: AnyKeys<ModelDoc>,
      checkExists: boolean = true
    ): Promise<ModelDoc[]> {
      filter = { ...crudOptions?.defaultFilter, ...filter };
      if (checkExists)
        await this.existsOrThrow(filter);
      await this.model.updateMany(filter, data);
      return this.model.find(filter);
    }

    async deleteOne(filter: FilterQuery<ModelDoc>): Promise<ModelDoc> {
      filter = { ...crudOptions?.defaultFilter, ...filter };
      await this.existsOrThrow(filter);
      return this.model.findOneAndDelete(filter);
    }
    async softDelete(
      filter: FilterQuery<ModelDoc>
    ): Promise<ModelDoc> {
      filter = { ...crudOptions?.defaultFilter, ...filter };
      await this.existsOrThrow(filter);
      await this.model.updateOne(filter, { isDeleted: true });
      return this.findOneOrFail(filter);
    }

    async list(
      filter: FilterQuery<ModelDoc>,
      paginationOptions: {
        limit?: number;
        skip?: number;
      } = {
          limit: 10,
          skip: 1,
        },
      options?: {
        populateArray?: any,
        filterOptions?: any
      },
    ): Promise<{
      docs: ModelDoc[];
      paginationData: {
        total: number;
        page: number;
        perPage: number;
      };
    }> {
      if (options?.filterOptions) filter = { ...filter, ...options.filterOptions };
      filter = { ...crudOptions?.defaultFilter, ...filter };

      const queryInstruction = this.model
        .find(filter)
        .limit(paginationOptions.limit)
        .skip(paginationOptions.skip);
      if (options?.populateArray) queryInstruction.populate(options.populateArray);

      const docs = await queryInstruction;
      const total = await this.model.countDocuments(filter);
      const paginationData = {
        total: total,
        page: paginationOptions.skip,
        perPage: paginationOptions.limit,
      };

      return { docs, paginationData };
    }

    async listAll(
      filter: FilterQuery<ModelDoc>,
      options?: {
        populateArray: any
      },
    ): Promise<ModelDoc[]> {
      filter = { ...crudOptions?.defaultFilter, ...filter };
      const queryInstruction = this.model.find(filter);
      if (options?.populateArray) queryInstruction.populate(options.populateArray);
      return queryInstruction;
    }

    async search(
      filter: FilterQuery<ModelDoc>,
      paginationOptions: {
        limit?: number;
        skip?: number;
      } = {
          limit: 10,
          skip: 1,
        },
      options?: {
        populateArray: any
      },
    ): Promise<{
      docs: ModelDoc[];
      paginationData: {
        total: number;
        page: number;
        perPage: number;
      };
    }> {
      filter = { ...crudOptions?.defaultFilter, ...filter };
      const queryInstruction = this.model
        .find(filter)
        .limit(paginationOptions.limit)
        .skip(paginationOptions.skip);
      if (options?.populateArray) queryInstruction.populate(options.populateArray);

      const docs = await queryInstruction;
      const total = await this.model.countDocuments(filter);
      const paginationData = {
        total: total,
        page: paginationOptions.skip,
        perPage: paginationOptions.limit,
      };

      return { docs, paginationData };
    }

    async findOne(
      filter: FilterQuery<ModelDoc>,
      options?: {
        populateArray: any
      }): Promise<ModelDoc | null> {
      const queryInstruction = this.model.findOne(filter);
      if (options?.populateArray) queryInstruction.populate(options.populateArray);
      const document = await queryInstruction
      return document;
    }

    async findOneOrFail(
      filter: FilterQuery<ModelDoc>,
      options?: {
        populateArray?: any,
        selectArray?: any
      }
    ): Promise<ModelDoc> {
      await this.existsOrThrow(filter);
      const queryInstruction = this.model.findOne(filter);
      if (options?.populateArray) queryInstruction.populate(options.populateArray);
      if (options?.selectArray) queryInstruction.select(options.selectArray);
      const document = await queryInstruction;
      return document;
    }

    private async existsOrThrow(filter: FilterQuery<ModelDoc>) {
      if (!(await this.model.exists(filter))) {
        throw new HttpError(404, "No Matching Result Found.");
      }
    }
  };
};
