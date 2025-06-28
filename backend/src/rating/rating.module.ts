import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingRepository } from './rating.repository';
import { PrismaService } from '../prisma.service';
import { RatingController } from './rating.controller';

@Module({
  controllers: [RatingController], 
  providers: [RatingService, RatingRepository, PrismaService],
  exports: [RatingService],
})
export class RatingModule {}