import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RatingRepository } from './rating.repository';

@Injectable()
export class RatingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ratingRepository: RatingRepository,
  ) {}

  async rateProvider(jobId: string, customerId: string, score: number, comment?: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.customerId !== customerId) throw new ForbiddenException('Not your job');
    if (job.status !== 'COMPLETED') throw new BadRequestException('Job not completed');
    if (!job.providerId) throw new BadRequestException('No provider for this job');

    // Prevent double rating
    const existing = await this.ratingRepository.findByJobAndProvider(jobId, job.providerId);
    if (existing) throw new BadRequestException('Already rated');

    return this.ratingRepository.createRating({
      score,
      comment,
      providerId: job.providerId,
      jobId,
    });
  }

  async getProviderRatings(providerId: string) {
    return this.ratingRepository.findByProvider(providerId);
  }

  async getJobRating(jobId: string) {
    return this.ratingRepository.findByJob(jobId);
  }
}