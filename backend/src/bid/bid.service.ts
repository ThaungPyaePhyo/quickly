import { Injectable } from '@nestjs/common';
import { BidRepository } from './bid.repository';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid } from '../../generated/prisma';

@Injectable()
export class BidService {
  constructor(private bidRepository: BidRepository) {}

  async createBid(dto: CreateBidDto, providerId: string): Promise<Bid> {
    return this.bidRepository.createBid({ ...dto, providerId });
  }

  async findByJobId(jobId: string): Promise<Bid[]> {
    return this.bidRepository.findByJobId(jobId);
  }
}