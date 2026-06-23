import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiCustomResponse<T> {
  @ApiProperty({
    description: 'Was operation successful?',
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description:
      'The result data, the JSON Object is different for each request',
    type: Object,
  })
  data: T | null;

  @ApiProperty({
    description: 'The message in case of error',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'The exception code in case of error',
    type: Number,
  })
  code: number;
  constructor(success: boolean, data: T | null, message: string, code: number) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.code = code;
  }
}
export interface IClientInfo {
  ipAddress: string;
  userAgent: string;
  timezone: string;
}
export interface ApiDocsOptions {
  summary: string;
  description?: string;
  body?: Type<any>;
  multipart?: boolean;
  successStatus?: number;
  successResponse?: Type<any>;
  successDescription?: string;
  isArray?: boolean;
  isPaginated?: boolean;
  errors?: ({ status: number; description: string } | number)[];
}
