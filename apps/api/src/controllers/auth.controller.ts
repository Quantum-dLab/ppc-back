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
import { ApiDoc } from '../common/decorators';
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
  @ApiDoc({
    summary: 'Register User',
    description: 'Creates a user account and returns authentication tokens.',
    body: RegisterDto,
    successStatus: HttpStatus.CREATED,
    successDescription: 'User registered successfully',
    successResponse: AuthTokenResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      {
        status: HttpStatus.CONFLICT,
        description: 'User with this email already exists',
      },
    ],
  })
  async register(@Body() dto: RegisterDto): Promise<AuthTokenResponseDto> {
    return AuthTokenResponseDto.fromResult(
      await this.registerUseCase.execute(dto),
    );
  }

  @Public()
  @Post('login')
  @ApiDoc({
    summary: 'Login User',
    description: 'Authenticates a user with email and password.',
    body: LoginDto,
    successDescription: 'Login successful',
    successResponse: AuthTokenResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid email or password',
      },
    ],
  })
  async login(@Body() dto: LoginDto): Promise<AuthTokenResponseDto> {
    return AuthTokenResponseDto.fromResult(
      await this.loginUseCase.execute(dto),
    );
  }

  @Public()
  @Post('refresh')
  @ApiDoc({
    summary: 'Refresh Token',
    description: 'Issues a new access token and refresh token pair.',
    body: RefreshTokenDto,
    successDescription: 'Token refreshed successfully',
    successResponse: AuthTokenResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or expired refresh token',
      },
    ],
  })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokenResponseDto> {
    return AuthTokenResponseDto.fromResult(
      await this.refreshTokenUseCase.execute(dto),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiDoc({
    summary: 'Logout User',
    description: 'Revokes the stored refresh token for the current session.',
    successDescription: 'Logout successful',
    successResponse: MessageResponseDto,
    errors: [HttpStatus.UNAUTHORIZED],
  })
  async logout(@CurrentUser() user: UserEntity): Promise<MessageResponseDto> {
    await this.logoutUseCase.execute(user.uid);
    return MessageResponseDto.of('Logout successful');
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiDoc({
    summary: 'Google OAuth Login',
    description: 'Redirects the user to the Google OAuth consent screen.',
    successDescription: 'Redirected to Google consent screen',
    errors: [HttpStatus.BAD_REQUEST],
  })
  googleAuth() {
    // Guard redirects to Google's consent screen; handler body is never reached.
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @ApiDoc({
    summary: 'Google OAuth Callback',
    description: 'Handles Google OAuth callback and returns tokens.',
    successDescription: 'Google authentication successful',
    successResponse: AuthTokenResponseDto,
    errors: [HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED],
  })
  async googleAuthCallback(
    @Req() req: { user: GoogleProfile },
  ): Promise<AuthTokenResponseDto> {
    return AuthTokenResponseDto.fromResult(
      await this.googleLoginUseCase.execute(req.user),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiDoc({
    summary: 'Get Current User',
    description: 'Returns the authenticated user profile.',
    successDescription: 'User profile retrieved successfully',
    successResponse: UserResponseDto,
    errors: [HttpStatus.UNAUTHORIZED],
  })
  me(@CurrentUser() user: UserEntity): UserResponseDto {
    return UserResponseDto.fromEntity(user);
  }
}
