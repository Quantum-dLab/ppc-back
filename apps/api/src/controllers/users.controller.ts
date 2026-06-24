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
  async list() {
    const users = await this.listUsers.execute();
    return users.map((user) => user.toPublic());
  }

  @Get(':uid')
  async get(@Param('uid') uid: string) {
    const user = await this.getUser.execute(uid);
    return user.toPublic();
  }

  @Patch(':uid')
  async update(@Param('uid') uid: string, @Body() dto: UpdateUserDto) {
    const user = await this.updateUser.execute(uid, dto);
    return user.toPublic();
  }
}
