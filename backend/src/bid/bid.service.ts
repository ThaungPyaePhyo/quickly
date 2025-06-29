import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BidRepository } from './bid.repository';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid, JobStatus } from '../../generated/prisma';
import { JobRepository } from '../job/job.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BidService {
    constructor(
        private bidRepository: BidRepository,
        private jobRepository: JobRepository,
        private prisma: PrismaService //

    ) { }

    async createBid(dto: CreateBidDto, providerId: string): Promise<Bid> {
        const job = await this.jobRepository.findById(dto.jobId);
        if (!job) throw new NotFoundException('Job not found');

        if (job.acceptPrice && dto.price <= job.acceptPrice) {
            await this.jobRepository.updateJob(dto.jobId, {
                providerId,
                status: JobStatus.ASSIGNED,
            });
        }
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

    async getTopRankedBids(jobId: string) {
        const bids = await this.bidRepository.findByJobId(jobId);

        const bidsWithRatings = await Promise.all(
            bids.map(async (bid) => {
                const provider = await this.prisma.user.findUnique({
                    where: { id: bid.providerId },
                    select: { rating: true },
                });
                return {
                    ...bid,
                    rating: provider?.rating ?? 1,
                };
            })
        );

        const ranked = bidsWithRatings
            .map(bid => ({
                ...bid,
                rankScore: bid.price * (1 / (bid.rating || 1)) * (bid.eta || 1),
            }))
            .sort((a, b) => a.rankScore - b.rankScore)
            .slice(0, 3);

        return ranked;
    }
}