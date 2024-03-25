import { Request } from "express";

export const parsePaginationQuery = (query: Request["query"]) => {
  const limit = query.limit && parseInt(query.limit as string) || 10;
  const skip = query.skip && parseInt(query.skip as string) || 0;

  return {
    limit,
    skip,
  };
};
