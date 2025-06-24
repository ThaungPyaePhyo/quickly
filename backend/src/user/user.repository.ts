import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '../../generated/prisma'; // Adjust path if needed

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; name: string; password: string; role: Role }) {
    return this.prisma.user.create({ data });
  }
}