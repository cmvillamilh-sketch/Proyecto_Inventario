import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

type SafeUser = Omit<User, 'passwordHash'>;

function toSafeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    return users.map(toSafeUser);
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return toSafeUser(user);
  }

  async create(data: CreateUserDto): Promise<SafeUser> {
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = this.userRepository.create({
      username: data.username,
      role: data.role,
      passwordHash,
    });

    try {
      const saved = await this.userRepository.save(user);
      return toSafeUser(saved);
    } catch (error) {
      if (error instanceof QueryFailedError && (error.driverError as { code?: string })?.code === '23505') {
        throw new ConflictException('Ya existe un usuario con ese username');
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateUserDto, currentUserId: string): Promise<SafeUser> {
    const user = await this.getEntityOrFail(id);

    if (data.isActive === false && id === currentUserId) {
      throw new BadRequestException('Un admin no puede desactivarse a sí mismo');
    }

    Object.assign(user, data);
    const saved = await this.userRepository.save(user);
    return toSafeUser(saved);
  }

  async remove(id: string, currentUserId: string): Promise<SafeUser> {
    if (id === currentUserId) {
      throw new BadRequestException('Un admin no puede desactivarse a sí mismo');
    }

    const user = await this.getEntityOrFail(id);
    user.isActive = false;
    const saved = await this.userRepository.save(user);
    return toSafeUser(saved);
  }

  async resetPassword(id: string, newPassword: string): Promise<SafeUser> {
    const user = await this.getEntityOrFail(id);
    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    const saved = await this.userRepository.save(user);
    return toSafeUser(saved);
  }

  private async getEntityOrFail(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
