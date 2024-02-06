import { Request } from "express";

export const parsePaginationQuery = (query: Request["query"]) => {
  const limit = query.take && parseInt(query.limit as string);
  const skip = query.skip && parseInt(query.skip as string);

  return {
    limit,
    skip,
  };
};
