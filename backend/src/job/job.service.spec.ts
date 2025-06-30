import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { JobRepository } from './job.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Job, JobStatus } from '../../generated/prisma';

describe('JobService', () => {
  let service: JobService;
  let jobRepository: jest.Mocked<JobRepository>;

  const mockJob: Job = {
    id: 'job-id',
    title: 'Test Job',
    description: 'A test job',
    categoryId: 'category-id',
    type: 'QUICK_BOOK',
    status: JobStatus.OPEN,
    price: 100,
    acceptPrice: null,
    scheduledAt: new Date(),
    acceptUntil: new Date(Date.now() + 30 * 1000), 
    createdAt: new Date(),
    customerId: 'customer-id',
    providerId: null,
  };

  beforeEach(async () => {
    const repoMock = {
      createJob: jest.fn().mockResolvedValue(mockJob),
      findAll: jest.fn().mockResolvedValue([mockJob]),
      findById: jest.fn().mockResolvedValue(mockJob),
      updateJob: jest.fn().mockResolvedValue({ ...mockJob, title: 'Updated' }),
      deleteJob: jest.fn().mockResolvedValue(mockJob),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        { provide: JobRepository, useValue: repoMock },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
    jobRepository = module.get(JobRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a job', async () => {
    const dto = { title: 'Test Job', description: 'A test job', category: 'General', type: 'QUICK_BOOK', price: 100 };
    const result = await service.createJob(dto as any, 'customer-id');
    expect(jobRepository.createJob).toHaveBeenCalled();
    expect(result).toEqual(mockJob);
  });

  it('should find all jobs', async () => {
    const result = await service.findAll();
    expect(jobRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockJob]);
  });

  it('should find job by id', async () => {
    const result = await service.findById('job-id');
    expect(jobRepository.findById).toHaveBeenCalledWith('job-id');
    expect(result).toEqual(mockJob);
  });

  it('should update a job', async () => {
    const result = await service.updateJob('job-id', { title: 'Updated' });
    expect(jobRepository.updateJob).toHaveBeenCalledWith('job-id', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  it('should throw NotFoundException when updating non-existent job', async () => {
    jobRepository.findById.mockResolvedValueOnce(null);
    await expect(service.updateJob('bad-id', { title: 'Updated' })).rejects.toThrow(NotFoundException);
  });

  it('should complete a job', async () => {
    jobRepository.updateJob.mockResolvedValueOnce({ ...mockJob, status: JobStatus.COMPLETED });
    const result = await service.completeJob('job-id', null);
    expect(jobRepository.updateJob).toHaveBeenCalledWith('job-id', { status: JobStatus.COMPLETED });
    expect(result.status).toBe(JobStatus.COMPLETED);
  });

  it('should throw NotFoundException when completing non-existent job', async () => {
    jobRepository.findById.mockResolvedValueOnce(null);
    await expect(service.completeJob('bad-id', 'provider-id')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if provider does not match', async () => {
    jobRepository.findById.mockResolvedValueOnce({ ...mockJob, providerId: 'other-provider' });
    await expect(service.completeJob('job-id', 'wrong-provider')).rejects.toThrow(ForbiddenException);
  });
});