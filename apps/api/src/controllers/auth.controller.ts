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
import { ApiDoc } from '../common/decorators';
import { UserPanel } from '../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { UserEntity } from '../domain/entities/user.entity';
import { GoogleProfile } from '../infrastructure/auth/google.strategy';
import { ApiCustomResponse } from '../common/types';

@UserPanel('auth')
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
    summary: 'Register a new user',
    description: 'Creates a new user account with email and password',
    body: RegisterDto,
    successStatus: HttpStatus.CREATED,
    successDescription: 'User registered successfully',
    successResponse: ApiCustomResponse,
    errors: [
      {
        status: HttpStatus.CONFLICT,
        description: 'User with this email already exists',
      },
      HttpStatus.BAD_REQUEST,
    ],
  })
  async register(@Body() dto: RegisterDto) {
    const { accessToken, refreshToken, user } =
      await this.registerUseCase.execute(dto);
    return { accessToken, refreshToken, user: user.toPublic() };
  }

  @Public()
  @Post('login')
  @ApiDoc({
    summary: 'User login',
    description: 'Authenticates a user with email and password',
    body: LoginDto,
    successDescription: 'Login successful',
    successResponse: ApiCustomResponse,
    errors: [
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid email or password',
      },
      HttpStatus.BAD_REQUEST,
    ],
  })
  async login(@Body() dto: LoginDto) {
    console.log('Login DTO:', dto); // Debugging line to log the incoming DTO
    const { accessToken, refreshToken, user } =
      await this.loginUseCase.execute(dto);
    return { accessToken, refreshToken, user: user.toPublic() };
  }

  @Public()
  @Post('refresh')
  @ApiDoc({
    summary: 'Refresh access token',
    description: 'Uses a refresh token to get a new access token and refresh token',
    body: RefreshTokenDto,
    successDescription: 'Token refreshed successfully',
    successResponse: ApiCustomResponse,
    errors: [
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or expired refresh token',
      },
      HttpStatus.BAD_REQUEST,
    ],
  })
  async refresh(@Body() dto: RefreshTokenDto) {
    const { accessToken, refreshToken, user } =
      await this.refreshTokenUseCase.execute(dto);
    return { accessToken, refreshToken, user: user.toPublic() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiDoc({
    summary: 'Logout user',
    description:
      'Revokes the stored refresh token for the authenticated user session',
    successDescription: 'Logout successful',
    successResponse: ApiCustomResponse,
    errors: [HttpStatus.UNAUTHORIZED],
  })
  async logout(@CurrentUser() user: UserEntity) {
    await this.logoutUseCase.execute(user.uid);
    return { message: 'Logout successful' };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiDoc({
    summary: 'Google OAuth login',
    description: 'Initiates Google OAuth authentication flow',
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
    summary: 'Google OAuth callback',
    description: 'Handles Google OAuth callback and returns tokens',
    successDescription: 'Google authentication successful',
    successResponse: ApiCustomResponse,
    errors: [HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED],
  })
  async googleAuthCallback(@Req() req: { user: GoogleProfile }) {
    const { accessToken, refreshToken, user } =
      await this.googleLoginUseCase.execute(req.user);
    return { accessToken, refreshToken, user: user.toPublic() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiDoc({
    summary: 'Get current user profile',
    description: "Returns the authenticated user's profile information",
    successDescription: 'User profile retrieved successfully',
    successResponse: ApiCustomResponse,
    errors: [HttpStatus.UNAUTHORIZED],
  })
  me(@CurrentUser() user: UserEntity) {
    return user.toPublic();
  }
}
