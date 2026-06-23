import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { ApiCustomResponse, ApiDocsOptions } from './types';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PagingResponseDto } from '@libs/shared';

export const API_CUSTOM_MESSAGE_KEY = 'META_KEY_API_CUSTOM_MESSAGE';

export const ApiCustomMessage = (message: string) =>
  SetMetadata(API_CUSTOM_MESSAGE_KEY, message);


export const ApiDoc = (opts: ApiDocsOptions) => {
  const isErrorObject = (
    err: number | { status: number; description?: string },
  ): err is { status: number; description?: string } => {
    return typeof err === 'object' && err !== null && 'status' in err;
  };

  const getErrorDescription = (status: number): string => {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return 'Authentication Failed';
      case HttpStatus.BAD_REQUEST:
        return 'Request Body/Params are not valid';
      case HttpStatus.FORBIDDEN:
        return 'User has no permission for this operation';
      case HttpStatus.NOT_FOUND:
        return 'Resource not found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      default:
        return 'Error';
    }
  };

  const decorators: any[] = [];
  decorators.push(
    ApiOperation({
      summary: opts.summary,
      description: opts.description || '',
    }),
  );
  if (opts.body) {
    decorators.push(ApiBody({ type: opts.body }));
  }
  if (opts.multipart) {
    decorators.push(ApiConsumes('multipart/form-data'));
  }
  if (opts.successResponse) {
    decorators.push(
      ApiExtraModels(
        ApiCustomResponse,
        PagingResponseDto,
        opts.successResponse,
      ),
    );
  } else {
    decorators.push(ApiExtraModels(ApiCustomResponse, PagingResponseDto));
  }

  let dataSchema: any;
  if (opts.isPaginated && opts.successResponse) {
    dataSchema = {
      allOf: [
        { $ref: getSchemaPath(PagingResponseDto) },
        {
          properties: {
            rows: {
              type: 'array',
              items: {
                $ref: getSchemaPath(opts.successResponse),
              },
            },
          },
        },
      ],
    };
  } else if (opts.successResponse) {
    dataSchema = opts.isArray
      ? {
          type: 'array',
          items: {
            $ref: getSchemaPath(opts.successResponse),
          },
        }
      : {
          $ref: getSchemaPath(opts.successResponse),
        };
  } else {
    dataSchema = {
      type: 'object',
      nullable: true,
      example: null,
    };
  }
  decorators.push(
    ApiResponse({
      status: opts.successStatus ?? 200,
      description: opts.successDescription ?? '',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiCustomResponse) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
  if (opts.errors) {
    for (const err of opts.errors) {
      const status = isErrorObject(err) ? err.status : err;
      const description = isErrorObject(err)
        ? (err.description ?? getErrorDescription(err.status))
        : getErrorDescription(err);

      decorators.push(
        ApiResponse({
          status,
          description,
          schema: {
            $ref: getSchemaPath(ApiCustomResponse),
          },
        }),
      );
    }
  }
  return applyDecorators(...decorators);
};
