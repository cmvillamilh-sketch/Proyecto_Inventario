import { BadRequestException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const exists = await this.userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!exists) {
      await this.userRepository.save(
        this.userRepository.create({
          username: 'admin',
          password: 'admin',
          role: 'coordinator',
        }),
      );
    }
  }

  async createUser(username: string, password: string, role = 'coordinator') {
    const existing = await this.userRepository.findOne({
      where: { username },
    });

    if (existing) {
      throw new BadRequestException('El usuario ya existe');
    }

    const user = this.userRepository.create({
      username,
      password,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
    };
  }

  async validateLogin(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username, password },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT_SECRET no configurado');
    }

    const accessToken = sign(
      {
        sub: user.id,
        username: user.username,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '1h' },
    );

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
