import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { User } from 'generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) { }

  async register(dto: CreateUserDto): Promise<string> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);

    await this.userRepository.createUser({
      email: dto.email,
      name: dto.name,
      password: hashed,
      role: dto.role,
    });

    return 'User registered';
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async update(userId: string, dto: UpdateUserDto) {
    return this.userRepository.updateUser(userId, dto);
  }
}