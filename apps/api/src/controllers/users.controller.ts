import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import {
  ListUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
} from '../application/use-cases/user';
import { UpdateUserDto } from '../application/dto/user/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../domain/entities/user.entity';
import { AdminPanel } from '../common/decorators/swagger.decorator';
import { UserResponseDto } from '../application/dto/user/user-response.dto';
import { ApiDoc } from '../common/decorators';

@AdminPanel('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(
    private readonly listUsers: ListUsersUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
  ) {}

  @Get()
  @ApiBearerAuth('Authorization')
  @ApiDoc({
    summary: 'Get Users',
    description: 'Returns all users for admin management.',
    successDescription: 'Users retrieved successfully',
    successResponse: UserResponseDto,
    isArray: true,
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
  })
  async list(): Promise<UserResponseDto[]> {
    const users = await this.listUsers.execute();
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  @Get(':uid')
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'uid',
    description: 'User public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiDoc({
    summary: 'Get User',
    description: 'Returns a user by public unique identifier.',
    successDescription: 'User retrieved successfully',
    successResponse: UserResponseDto,
    errors: [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async get(@Param('uid') uid: string): Promise<UserResponseDto> {
    const user = await this.getUser.execute(uid);
    return UserResponseDto.fromEntity(user);
  }

  @Patch(':uid')
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'uid',
    description: 'User public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiDoc({
    summary: 'Update User',
    description: 'Updates admin-managed user fields.',
    body: UpdateUserDto,
    successDescription: 'User updated successfully',
    successResponse: UserResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async update(
    @Param('uid') uid: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUser.execute(uid, dto);
    return UserResponseDto.fromEntity(user);
  }
}
