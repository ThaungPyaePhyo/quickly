import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}