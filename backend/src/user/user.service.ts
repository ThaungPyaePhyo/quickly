import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

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
}