import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BidRepository } from './bid.repository';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid, JobStatus } from '../../generated/prisma';
import { JobRepository } from '../job/job.repository';

@Injectable()
export class BidService {
    constructor(
        private bidRepository: BidRepository,
        private jobRepository: JobRepository 

    ) { }

    async createBid(dto: CreateBidDto, providerId: string): Promise<Bid> {
        return this.bidRepository.createBid({ ...dto, providerId });
    }

    async findByJobId(jobId: string): Promise<Bid[]> {
        return this.bidRepository.findByJobId(jobId);
    }

    async acceptBid(bidId: string, customerId: string) {
        const bid = await this.bidRepository.findById(bidId);
        if (!bid) throw new NotFoundException('Bid not found');

        const job = await this.jobRepository.findById(bid.jobId);
        if (!job) throw new NotFoundException('Job not found');
        if (job.customerId !== customerId) throw new ForbiddenException('Not your job');

        return this.jobRepository.updateJob(job.id, {
            providerId: bid.providerId,
            status: JobStatus.ASSIGNED, 
            acceptPrice: bid.price,
        });
    }
}