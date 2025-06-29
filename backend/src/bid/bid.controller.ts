import { Controller, Post, Patch, Body, Req, UseGuards, UsePipes, ValidationPipe, Get, Param } from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Bid } from '../../generated/prisma';

@Controller('bid')
export class BidController {
    constructor(private readonly bidService: BidService) { }

    @UseGuards(SessionAuthGuard, new RoleGuard('PROVIDER'))
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createBid(@Body() dto: CreateBidDto, @Req() req: any): Promise<Bid> {
        return this.bidService.createBid(dto, req.session.userId);
    }

    @Get('job/:jobId')
    async getBidsByJob(@Param('jobId') jobId: string): Promise<Bid[]> {
        return this.bidService.findByJobId(jobId);
    }

    @UseGuards(SessionAuthGuard, new RoleGuard('CUSTOMER'))
    @Patch(':bidId/accept')
    async acceptBid(@Param('bidId') bidId: string, @Req() req: any) {
        return this.bidService.acceptBid(bidId, req.session.userId);
    }

    @Get('top/:jobId')
    async getTopRankedBids(@Param('jobId') jobId: string) {
        return this.bidService.getTopRankedBids(jobId);
    }
}