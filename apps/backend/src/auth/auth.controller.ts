import { Body, Controller, Post, BadRequestException } from '@nestjs/common';

class LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: LoginDto) {
    if (!body.username || !body.password) {
      throw new BadRequestException('username and password are required');
    }

    return {
      accessToken: 'demo-token',
      user: {
        id: '1',
        username: body.username,
        role: 'coordinator',
      },
    };
  }
}
