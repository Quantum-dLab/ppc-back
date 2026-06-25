import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const AdminPanel = (tag: string) =>
  applyDecorators(ApiTags(`Admin | ${tag}`));

export const UserPanel = (tag: string) =>
  applyDecorators(ApiTags(`User | ${tag}`));
