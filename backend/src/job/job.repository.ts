import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Job, JobType, JobStatus } from '../../generated/prisma';

@Injectable()
export class JobRepository {
    constructor(private prisma: PrismaService) { }

    async createJob(data: {
        title: string;
        description?: string;
        categoryId: string;
        type: JobType;
        status: JobStatus;
        price: number;
        acceptPrice?: number;
        scheduledAt: Date;
        customerId: string;
    }): Promise<Job> {
        return this.prisma.job.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                status: data.status,
                price: data.price,
                acceptPrice: data.acceptPrice,
                scheduledAt: data.scheduledAt,
                customer: { connect: { id: data.customerId } },
                category: { connect: { id: data.categoryId } },
            },
        });
    }

    async findAll(): Promise<any[]> {
        return this.prisma.job.findMany({
            include: {
                category: true, 
                _count: {
                    select: { bids: true },
                },
            },
        });
    }

    async findById(id: string): Promise<Job | null> {
        return this.prisma.job.findUnique({
            where: { id },
            include: { category: true }, 
        });
    }

    async updateJob(id: string, data: Partial<Job>): Promise<Job> {
        return this.prisma.job.update({
            where: { id },
            data,
        });
    }

    async deleteJob(id: string): Promise<Job> {
        return this.prisma.job.delete({
            where: { id },
        });
    }
}