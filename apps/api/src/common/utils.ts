import { HttpStatus } from "@nestjs/common";
import { ApiCustomResponse } from "./types";
import { ExceptionCode } from "@libs/shared/exceptions";

export function successResponse<T>(
  _data: T | null,
  _message: string = "",
  _code: number = ExceptionCode.NONE,
): ApiCustomResponse<T> {
  return new ApiCustomResponse<T>(true, _data as T, _message, _code);
}

export function errorResponse(
  _message: string = "Internal Server Error",
  _code: number = HttpStatus.INTERNAL_SERVER_ERROR,
): ApiCustomResponse<null> {
  return new ApiCustomResponse<null>(false, null, _message, _code);
}

export function permissionErrorResponse(): ApiCustomResponse<null> {
  return errorResponse(
    "You don't have permission for this operation",
    HttpStatus.FORBIDDEN,
  );
}


