import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';

@Controller('stats')
@UseGuards(SessionAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(@Req() req) {
    return this.statsService.getStatsForUser(req.session.user.role, req.session.userId);
  }

  @Get('recent-activity')
async getRecentActivity(@Req() req) {
  return this.statsService.getRecentActivity(req.session.user.role, req.session.userId);
}
}