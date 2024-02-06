interface JsonResponseProps {
  status?: number;
  message?: string;
  data?: Record<string, any> | Record<string, any>[];
  meta?: {
    total: number;
    page: number;
    perPage: number;
  };
}

export class JsonResponse {
  public status: JsonResponseProps["status"];
  public message: JsonResponseProps["message"];
  public data: JsonResponseProps["data"];
  public meta?: JsonResponseProps["meta"];

  constructor(props: JsonResponseProps) {
    this.status = props.status || 200;
    this.message = props.message || "Success";
    this.data = props.data || {};
    this.meta = props.meta;
  }
}
