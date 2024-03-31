import { Response } from "express";
import {
  IJSONSuccessResponse,
  IJSONErrorResponse,
  IJSONValidationErrorResponse,
} from "./json-responses";
import {
  IJSONSuccessResponseProps,
  IJSONErrorResponseProps,
  IJSONValidationErrorResponseProps,
} from "./json-responses-params";

/**
 * Represents a base class for JSON responses.
 */
export abstract class JsonResponse {
  private constructor() {}

  /**
   * Generates a success response object.
   *
   * @param props - The properties for the success response.
   * @param res - Optional Express response object to send the response.
   * @returns The success response object or the Express response object if provided.
   */
  static success(props: IJSONSuccessResponseProps): IJSONSuccessResponse;
  static success(
    props: IJSONSuccessResponseProps,
    res: Response<IJSONSuccessResponse>
  ): Response<IJSONSuccessResponse>;
  static success(
    props: IJSONSuccessResponseProps,
    res?: Response<IJSONSuccessResponse>
  ): IJSONSuccessResponse | Response<IJSONSuccessResponse> {
    const data = {
      status: props.status || 200,
      message: props.message || "Success",
      data: props.data || null,
      meta: props.meta,
    } satisfies IJSONSuccessResponse;

    return (res && res.status(data.status).json(data)) || data;
  }

  /**
   * Creates a JSON error response.
   * @param props - The properties for the error response.
   * @param res - Optional response object to send the error response.
   * @returns The JSON error response object or the response object if provided.
   */
  static error(props: IJSONErrorResponseProps): IJSONErrorResponse;
  static error(
    props: IJSONErrorResponseProps,
    res: Response<IJSONErrorResponse>
  ): Response<IJSONErrorResponse>;
  static error(
    props: IJSONErrorResponseProps,
    res?: Response<IJSONErrorResponse>
  ): IJSONErrorResponse | Response<IJSONErrorResponse> {
    const data = {
      status: props.status || 500,
      message: props.message || "Something Went Wrong",
      error: props.error,
    } satisfies IJSONErrorResponse;

    return (res && res.status(data.status).json(data)) || data;
  }

  /**
   * Represents a validation error response.
   * @param props - The properties of the validation error response.
   * @param res - Optional response object to send the JSON response.
   * @returns The validation error response object or the response object if provided.
   */
  static validationError(
    props: IJSONValidationErrorResponseProps
  ): IJSONValidationErrorResponse;
  static validationError(
    props: IJSONValidationErrorResponseProps,
    res: Response<IJSONValidationErrorResponse>
  ): Response<IJSONValidationErrorResponse>;
  static validationError(
    props: IJSONValidationErrorResponseProps,
    res?: Response<IJSONValidationErrorResponse>
  ): IJSONValidationErrorResponse | Response<IJSONValidationErrorResponse> {
    const data = {
      status: 422,
      message: "Validation Error",
      errors: props.errors,
    } satisfies IJSONValidationErrorResponse;

    return (res && res.status(data.status).json(data)) || data;
  }
}
