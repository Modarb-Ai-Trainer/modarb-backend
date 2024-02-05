export class JsonResponse {
  public status: number;
  public message: string;
  public data: Record<string, any> | Record<string, any>[];
  public meta?: {
    total: number;
    page: number;
    perPage: number;
  };

  constructor(props: {
    status?: number;
    message?: string;
    data?: Record<string, any> | Record<string, any>[];
    meta?: {
      total: number;
      page: number;
      perPage: number;
    };
  }) {
    this.status = props.status || 200;
    this.message = props.message || "Success";
    this.data = props.data || {};
    this.meta = props.meta;
  }
}
