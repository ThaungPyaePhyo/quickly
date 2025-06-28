import { Controller,Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { RoleGuard } from '../auth/role.guard';

@Controller('rating')
@UseGuards(SessionAuthGuard, new RoleGuard('CUSTOMER'))
export class RatingController {
    constructor(private readonly ratingService: RatingService) { }

    @Post('job/:jobId/rate')
    async rateProvider(
        @Param('jobId') jobId: string,
        @Body() body: { score: number; comment?: string },
        @Req() req: any
    ) {
        return this.ratingService.rateProvider(jobId, req.session.userId, body.score, body.comment);
    }

    @Get('job/:jobId')
    async getJobRatings(@Param('jobId') jobId: string) {
        return this.ratingService.getJobRating(jobId);
    }

    @Get('provider/:providerId')
    async getProviderRatings(@Param('providerId') providerId: string) {
        return this.ratingService.getProviderRatings(providerId);
    }
}