import { HttpStatus } from "@nestjs/common";

export enum ExceptionCode {
  NONE = 0,
  INTERNAL_ERROR = 1001,
  INVALID_CREDENTIALS = 1002,
  AUTHENTICATION_FAILED = 1003,
  PERMISSION_DENIED = 1004,
  NOT_FOUND = 1005,
  CONFLICT = 1006,
}

export class CustomException extends Error {
  public code: ExceptionCode;
  public statusCode: number;

  constructor(
    message: string = "Internal Server Error",
    code: ExceptionCode = ExceptionCode.INTERNAL_ERROR,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message);

    this.name = "CustomException";
    this.code = code;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomException.prototype);
  }
}

export function InternalErrorException(): CustomException {
  return new CustomException();
}

export function InvalidCredentialsException(): CustomException {
  return new CustomException(
    "Invalid Credentials",
    ExceptionCode.INVALID_CREDENTIALS,
    HttpStatus.UNAUTHORIZED,
  );
}

export function AuthenticationFailedException(): CustomException {
  return new CustomException(
    "Authentication Failed",
    ExceptionCode.AUTHENTICATION_FAILED,
    HttpStatus.UNAUTHORIZED,
  );
}

export function PermissionDeniedException(): CustomException {
  return new CustomException(
    "Permission Denied",
    ExceptionCode.PERMISSION_DENIED,
    HttpStatus.FORBIDDEN,
  );
}

export function NotFoundException(): CustomException {
  return new CustomException(
    "Not Found",
    ExceptionCode.NOT_FOUND,
    HttpStatus.NOT_FOUND,
  );
}

export function ConflictException(msg: string): CustomException {
  return new CustomException(
    msg || "Conflict Error",
    ExceptionCode.CONFLICT,
    HttpStatus.CONFLICT,
  );
}
