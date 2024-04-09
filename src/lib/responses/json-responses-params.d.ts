export type IJSONSuccessResponseProps<T extends Record<string, any> | Record<string, any>[]> = {
  status?: number;
  message?: string;
  data?: T | null;
}
& 
(T extends any[] ? {
  meta:  {
    total: number;
    page: number;
    perPage: number;
  };
} : {});

export interface IJSONErrorResponseProps {
  status?: number;
  message?: string;
  error: string;
}

export interface IJSONValidationErrorResponseProps {
  errors: Record<string, any>[];
}
