import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RatingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRating(data: { score: number; comment?: string; providerId: string; jobId: string }) {
    return this.prisma.rating.create({ data });
  }

  async findByJobAndProvider(jobId: string, providerId: string) {
    return this.prisma.rating.findFirst({
      where: { jobId, providerId },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.rating.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByJob(jobId: string) {
    return this.prisma.rating.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });
  }
}