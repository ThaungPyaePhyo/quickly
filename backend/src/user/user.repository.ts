import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role, User } from '../../generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; name: string; password: string; role: Role }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const { isAvailable, ...rest } = dto;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...rest,
        ...(isAvailable !== undefined ? { isAvailable } : {}),
      },
    });
  }



}