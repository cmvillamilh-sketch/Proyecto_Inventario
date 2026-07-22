import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  username: string;
  password: string;
}

class RegisterDto {
  username: string;
  password: string;
  role?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    if (!body.username || !body.password) {
      throw new BadRequestException('username and password are required');
    }

    return this.authService.validateLogin(body.username, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (!body.username || !body.password) {
      throw new BadRequestException('username and password are required');
    }

    return this.authService.createUser(body.username, body.password, body.role);
  }
}
