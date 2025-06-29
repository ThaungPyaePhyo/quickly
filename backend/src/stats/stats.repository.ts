import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsRepository {
  constructor(private prisma: PrismaService) {}

  async countJobsPosted(customerId: string) {
    return this.prisma.job.count({ where: { customerId } });
  }

  async countJobsCompletedByCustomer(customerId: string) {
    return this.prisma.job.count({ where: { customerId, status: 'COMPLETED' } });
  }

    async countActiveJobsByCustomer(customerId: string) {
    return this.prisma.job.count({
      where: {
        customerId,
        status: { in: ['OPEN', 'BOOKED', 'ASSIGNED'] },
      },
    });
  }

  async countJobsCompletedByProvider(providerId: string) {
    return this.prisma.job.count({ where: { providerId, status: 'COMPLETED' } });
  }

  async avgRatingByProvider(providerId: string) {
    const result = await this.prisma.rating.aggregate({
      _avg: { score: true },
      where: { providerId },
    });
    return result._avg.score || 0;
  }

   async countActiveJobsByProvider(providerId: string) {
    return this.prisma.job.count({
      where: {
        providerId,
        status: { in: ['OPEN', 'BOOKED', 'ASSIGNED'] },
      },
    });
  }

  async getRecentActivityForCustomer(customerId: string) {
    return this.prisma.job.findMany({
      where: { customerId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        title: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async getRecentActivityForProvider(providerId: string) {
    return this.prisma.job.findMany({
      where: { providerId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        title: true,
        status: true,
        updatedAt: true,
      },
    });
  }
}
