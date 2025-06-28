import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JobRepository } from './job.repository';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, JobStatus } from 'generated/prisma';

@Injectable()
export class JobService {
    constructor(private jobRepository: JobRepository) { }

    async createJob(dto: CreateJobDto, customerId: string): Promise<Job> {
        let acceptUntil: Date | undefined = undefined;
        if (dto.type === 'QUICK_BOOK') {
            acceptUntil = new Date(Date.now() + 30 * 1000);
        }
        return this.jobRepository.createJob({
            ...dto,
            status: JobStatus.OPEN,
            scheduledAt: new Date(),
            acceptUntil: acceptUntil,
            customerId,
            categoryId: dto.categoryId,
        });
    }


    async findAll(): Promise<Job[]> {
        return this.jobRepository.findAll();
    }

    async findById(id: string): Promise<Job | null> {
        return this.jobRepository.findById(id);
    }

    async updateJob(id: string, data: Partial<Job>): Promise<Job> {
        const job = await this.jobRepository.findById(id);
        if (!job) throw new NotFoundException('Job not found');
        return this.jobRepository.updateJob(id, data);
    }

    async deleteJob(id: string): Promise<Job> {
        const job = await this.jobRepository.findById(id);
        if (!job) throw new NotFoundException('Job not found');
        return this.jobRepository.deleteJob(id);
    }

    async completeJob(id: string, providerId: string): Promise<Job> {
        const job = await this.jobRepository.findById(id);
        if (!job) throw new NotFoundException('Job not found');
        if (job.providerId !== providerId) throw new ForbiddenException('Not your job');
        return this.jobRepository.updateJob(id, { status: JobStatus.COMPLETED });
    }

    async acceptQuickBookJob(jobId: string, providerId: string) {
          const job = await this.jobRepository.findById(jobId);
        if (!job) throw new NotFoundException('Job not found');
        if (job.status !== JobStatus.OPEN) throw new ForbiddenException('Job is not open');
        if (job.acceptUntil && new Date() > new Date(job.acceptUntil)) {
            throw new ForbiddenException('Acceptance window expired');
        }
        return this.jobRepository.updateJob(jobId, {
            providerId,
            status: JobStatus.BOOKED,
        });
    }

    async cancelJob(id: string, userId: string): Promise<Job> {
        const job = await this.jobRepository.findById(id);
        if (!job) throw new NotFoundException('Job not found');
        if (job.customerId !== userId && job.providerId !== userId) {
            throw new ForbiddenException('Not authorized to cancel this job');
        }
        return this.jobRepository.updateJob(id, { status: JobStatus.CANCELLED });
    }
}