import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';

@Injectable()
export class StatsService {
  constructor(private statsRepository: StatsRepository) {}

  async getStatsForUser(userRole: string , userId: string) {
    
    if (userRole === 'CUSTOMER') {
      const jobsPosted = await this.statsRepository.countJobsPosted(userId);
      const jobsCompleted = await this.statsRepository.countJobsCompletedByCustomer(userId);
      const activeJobs = await this.statsRepository.countActiveJobsByCustomer(userId);
      return { jobsPosted, jobsCompleted, activeJobs };
    } else {
      const jobsCompleted = await this.statsRepository.countJobsCompletedByProvider(userId);
      const avgRating = await this.statsRepository.avgRatingByProvider(userId);
      const activeJobs = await this.statsRepository.countActiveJobsByProvider(userId);
      return { jobsCompleted, avgRating, activeJobs };
    }
  }

    async getRecentActivity(userRole: string, userId: string) {
    if (userRole === 'CUSTOMER') {
      return this.statsRepository.getRecentActivityForCustomer(userId);
    } else {
      return this.statsRepository.getRecentActivityForProvider(userId);
    }
  }
}