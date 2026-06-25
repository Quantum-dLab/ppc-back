import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  RegisterUseCase,
  LoginUseCase,
  GoogleLoginUseCase,
} from '../application/use-cases/auth';
import { RegisterDto } from '../application/dto/auth/register.dto';
import { LoginDto } from '../application/dto/auth/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { UserEntity } from '../domain/entities/user.entity';
import { GoogleProfile } from '../infrastructure/auth/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { accessToken, user } = await this.registerUseCase.execute(dto);
    return { accessToken, user: user.toPublic() };
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { accessToken, user } = await this.loginUseCase.execute(dto);
    return { accessToken, user: user.toPublic() };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() {
    // Guard redirects to Google's consent screen; handler body is never reached.
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(@Req() req: { user: GoogleProfile }) {
    const { accessToken, user } = await this.googleLoginUseCase.execute(
      req.user,
    );
    return { accessToken, user: user.toPublic() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: UserEntity) {
    return user.toPublic();
  }
}
