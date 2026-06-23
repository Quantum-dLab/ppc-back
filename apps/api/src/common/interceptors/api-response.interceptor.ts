import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ApiCustomResponse } from '../types';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { API_CUSTOM_MESSAGE_KEY } from '../decorators';
import { successResponse } from '../utils';

export class ApiResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiCustomResponse<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiCustomResponse<T>> {
    // Getting custom message that is set as meta-data in controller
    const customMessage = this.reflector.get<string>(
      API_CUSTOM_MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        const message = customMessage || "Success";
        // const statusCode = response.statusCode;

        if (data instanceof ApiCustomResponse) {
          return data;
        }

        return successResponse(data, message);
      }),
    );
  }
}
