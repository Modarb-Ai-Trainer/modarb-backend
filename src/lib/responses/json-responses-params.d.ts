export interface IJSONSuccessResponseProps {
  status?: number;
  message?: string;
  data?: Record<string, any> | Record<string, any>[] | null;
  meta?: {
    total: number;
    page: number;
    perPage: number;
  };
}

export interface IJSONErrorResponseProps {
  status?: number;
  message?: string;
  error: string;
}

export interface IJSONValidationErrorResponseProps {
  errors: Record<string, any>[];
}
