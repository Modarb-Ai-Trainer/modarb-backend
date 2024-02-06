import http from "http";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message?: string | object) {
    if (typeof message === "object") {
      message = JSON.stringify(message);
    }

    super(message || http.STATUS_CODES[status] || "Error");
    this.status = status;
  }
}
