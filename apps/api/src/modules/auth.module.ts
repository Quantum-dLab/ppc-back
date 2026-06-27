import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtConfig } from '../configs/jwt.config';
import { GoogleConfig } from '../configs/google.config';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { TokenService } from '../infrastructure/auth/token.service';
import { JwtStrategy } from '../infrastructure/auth/jwt.strategy';
import { GoogleStrategy } from '../infrastructure/auth/google.strategy';
import { AuthController } from '../controllers/auth.controller';
import { UsersController } from '../controllers/users.controller';
import {
  RegisterUseCase,
  LoginUseCase,
  ValidateUserByIdUseCase,
  GoogleLoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
} from '../application/use-cases/auth';
import {
  ListUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
} from '../application/use-cases/user';

const AUTH_USE_CASES = [
  RegisterUseCase,
  LoginUseCase,
  ValidateUserByIdUseCase,
  GoogleLoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
];

const USER_USE_CASES = [ListUsersUseCase, GetUserUseCase, UpdateUserUseCase];

@Module({
  imports: [
    ConfigModule.forFeature(JwtConfig),
    ConfigModule.forFeature(GoogleConfig),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          secret: config.getOrThrow<string>('jwt.secret'),
          signOptions: {
            expiresIn: config.get<string>('jwt.expiresIn'),
          },
        }) as JwtModuleOptions,
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    TokenService,
    JwtStrategy,
    GoogleStrategy,
    ...AUTH_USE_CASES,
    ...USER_USE_CASES,
  ],
  exports: [USER_REPOSITORY, ...AUTH_USE_CASES, ...USER_USE_CASES],
})
export class AuthModule {}
