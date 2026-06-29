import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
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
import {
  ApiGetUserDocs,
  ApiListUsersDocs,
  ApiUpdateUserDocs,
} from '../common/core-swagger.decorator';

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
  @ApiListUsersDocs()
  async list(): Promise<UserResponseDto[]> {
    const users = await this.listUsers.execute();
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  @Get(':uid')
  @ApiGetUserDocs()
  async get(@Param('uid') uid: string): Promise<UserResponseDto> {
    const user = await this.getUser.execute(uid);
    return UserResponseDto.fromEntity(user);
  }

  @Patch(':uid')
  @ApiUpdateUserDocs()
  async update(
    @Param('uid') uid: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUser.execute(uid, dto);
    return UserResponseDto.fromEntity(user);
  }
}
