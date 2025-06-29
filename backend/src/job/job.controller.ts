import { Controller, Post, Patch, Delete, Body, Param, Req, UseGuards, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Job } from 'generated/prisma';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) { }

    @UseGuards(SessionAuthGuard, new RoleGuard('CUSTOMER'))
    @Post('create')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createJob(@Body() dto: CreateJobDto, @Req() req: any): Promise<Job> {
        return this.jobService.createJob(dto, req.session.userId);
    }

    @Get()
    async getJobs(): Promise<Job[]> {
        return this.jobService.findAll();
    }

    @Get(':id')
    async getJobById(@Param('id') id: string): Promise<Job | null> {
        return this.jobService.findById(id);
    }

    @UseGuards(SessionAuthGuard, new RoleGuard('PROVIDER'))
    @Patch(':id/complete')
    async completeJob(@Param('id') id: string, @Req() req: any) {
        return this.jobService.completeJob(id, req.session.userId);
    }

    @UseGuards(SessionAuthGuard, new RoleGuard('PROVIDER'))
    @Post(':id/accept')
    async acceptQuickBookJob(@Param('id') id: string, @Req() req) {
        const providerId = req.session.userId;
        return this.jobService.acceptQuickBookJob(id, providerId);
    }

    @UseGuards(SessionAuthGuard)
    @Patch(':id/cancel')
    async cancelJob(@Param('id') id: string, @Req() req: any) {
        return this.jobService.cancelJob(id, req.session.userId);
    }

} 