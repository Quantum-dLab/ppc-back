import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  RegisterUseCase,
  LoginUseCase,
  GoogleLoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
} from '../application/use-cases/auth';
import { RegisterDto } from '../application/dto/auth/register.dto';
import { LoginDto } from '../application/dto/auth/login.dto';
import { RefreshTokenDto } from '../application/dto/auth/refresh-token.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserPanel } from '../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { UserEntity } from '../domain/entities/user.entity';
import { GoogleProfile } from '../infrastructure/auth/google.strategy';
import {
  AuthTokenResponseDto,
  MessageResponseDto,
} from '../application/dto/auth/auth-response.dto';
import { UserResponseDto } from '../application/dto/user/user-response.dto';
import {
  ApiGetMeDocs,
  ApiGoogleCallbackDocs,
  ApiGoogleLoginDocs,
  ApiLoginDocs,
  ApiLogoutDocs,
  ApiRefreshTokenDocs,
  ApiRegisterDocs,
} from '../common/core-swagger.decorator';

@UserPanel('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Public()
  @Post('register')
  @ApiRegisterDocs()
  async register(@Body() dto: RegisterDto): Promise<AuthTokenResponseDto> {
    return AuthTokenResponseDto.fromResult(
      await this.registerUseCase.execute(dto),
    );
  }

  @Public()
  @Post('login')
  @ApiLoginDocs()
  async login(@Body() dto: LoginDto): Promise<AuthTokenResponseDto> {
    return AuthTokenResponseDto.fromResult(
      await this.loginUseCase.execute(dto),
    );
  }

  @Public()
  @Post('refresh')
  @ApiRefreshTokenDocs()
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokenResponseDto> {
    return AuthTokenResponseDto.fromResult(
      await this.refreshTokenUseCase.execute(dto),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiLogoutDocs()
  async logout(@CurrentUser() user: UserEntity): Promise<MessageResponseDto> {
    await this.logoutUseCase.execute(user.uid);
    return MessageResponseDto.of('Logout successful');
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiGoogleLoginDocs()
  googleAuth() {
    // Guard redirects to Google's consent screen; handler body is never reached.
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @ApiGoogleCallbackDocs()
  async googleAuthCallback(
    @Req() req: { user: GoogleProfile },
  ): Promise<AuthTokenResponseDto> {
    return AuthTokenResponseDto.fromResult(
      await this.googleLoginUseCase.execute(req.user),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiGetMeDocs()
  me(@CurrentUser() user: UserEntity): UserResponseDto {
    return UserResponseDto.fromEntity(user);
  }
}
