import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingRepository } from './rating.repository';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [RatingService, RatingRepository, PrismaService],
  exports: [RatingService],
})
export class RatingModule {}