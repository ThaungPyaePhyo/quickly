import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AuthController],
    providers: [AuthService, AuthRepository, PrismaService],
})
export class AuthModule {}
