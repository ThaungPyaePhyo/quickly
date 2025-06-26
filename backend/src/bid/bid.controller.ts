import { Controller, Post, Body, Req, UseGuards, UsePipes, ValidationPipe, Get, Param } from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Bid } from '../../generated/prisma';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

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
}