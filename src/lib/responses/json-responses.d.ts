interface IJSONResponse {
  status: number;
  message: string;
}

export type IJSONSuccessResponse<T extends Record<string, any> | Record<string, any>[]> = IJSONResponse & {
  data: T;
}
& 
(T extends any[] ? {
  meta:  {
    total: number;
    page: number;
    perPage: number;
  };
} : {});

export interface IJSONErrorResponse extends IJSONResponse {
  error: string;
}

export interface IJSONValidationErrorResponse extends IJSONResponse {
  status: 422;
  message: "Validation Error";
  errors: Record<string, any>[];
}
