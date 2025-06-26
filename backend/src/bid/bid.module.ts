import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { BidRepository } from './bid.repository';
import { PrismaService } from '../prisma.service';
import { JobModule } from 'src/job/job.module';

@Module({
  imports: [JobModule],
  controllers: [BidController],
    providers: [BidService, BidRepository, PrismaService],
})
export class BidModule {}
