import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Bid } from '../../generated/prisma';

@Injectable()
export class BidRepository {
    constructor(private prisma: PrismaService) { }

    async createBid(data: { jobId: string; providerId: string; price: number; note?: string; eta?: number }): Promise<Bid> {
        return this.prisma.bid.create({
            data: {
                job: { connect: { id: data.jobId } },
                provider: { connect: { id: data.providerId } },
                price: data.price,
                note: data.note,
                eta: data.eta ?? 0,
            },
        });
    }

    async findByJobId(jobId: string): Promise<Bid[]> {
        return this.prisma.bid.findMany({
            where: { jobId },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        rating: true,
                    },
                },
            },
        });
    }

    async findById(id: string): Promise<Bid | null> {
        return this.prisma.bid.findUnique({ where: { id } });
    }
}