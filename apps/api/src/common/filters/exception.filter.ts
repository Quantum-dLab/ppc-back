import {
  ArgumentsHost,
  BadRequestException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { ApiCustomResponse } from "../types";
import { CustomException, ExceptionCode } from "@libs/shared/exceptions";
export class AllExceptionFilter implements ExceptionFilter {
  private logger: Logger;
  constructor() {
    this.logger = new Logger("Exception Filter");
  }

  catch(exception: any, host: ArgumentsHost) {
    
    const response = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let code = ExceptionCode.INTERNAL_ERROR;

    if (exception instanceof CustomException) {
      status = exception.statusCode;
      message = exception.message;
      code = exception.code;
    } else if (exception instanceof BadRequestException) {
      // Concatenate validation errors if there are one or many errors
      status = exception.getStatus();
      const exceptionObj: any = exception.getResponse();

      // if its not an Array, then its not coming from Custom Validation Pipe
      message = Array.isArray(exceptionObj.errors)
        ? exceptionObj.errors.join("\n")
        : exception.message;

      this.logger.log("Bad Request exception:", message);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      code = ExceptionCode.NONE;
    }

    response
      .status(status)
      .json(new ApiCustomResponse(false, null, message, code));
  }
}
