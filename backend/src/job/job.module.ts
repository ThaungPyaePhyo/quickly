import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobRepository } from './job.repository';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [JobService, JobRepository, PrismaService],
  controllers: [JobController]
})
export class JobModule {}
