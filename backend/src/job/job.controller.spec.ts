import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { Job } from 'generated/prisma';

describe('JobController', () => {
  let controller: JobController;
  let service: JobService;

  const mockJob: Job = {
    id: 'job-id',
    title: 'Test Job',
    description: 'A test job',
    category: 'General',
    type: 'QUICK_BOOK',
    status: 'OPEN',
    price: 100,
    acceptPrice: null,
    scheduledAt: new Date(),
    createdAt: new Date(),
    customerId: 'customer-id',
    providerId: null,
  };

  const mockJobService = {
    createJob: jest.fn().mockResolvedValue(mockJob),
    findAll: jest.fn().mockResolvedValue([mockJob]),
    findById: jest.fn().mockResolvedValue(mockJob),
    updateJob: jest.fn().mockResolvedValue({ ...mockJob, title: 'Updated' }),
    deleteJob: jest.fn().mockResolvedValue(mockJob),
    completeJob: jest.fn().mockResolvedValue({ ...mockJob, status: 'COMPLETED' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        { provide: JobService, useValue: mockJobService },
      ],
    }).compile();

    controller = module.get<JobController>(JobController);
    service = module.get<JobService>(JobService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a job', async () => {
    const dto = { title: 'Test Job', description: 'A test job', category: 'General', type: 'QUICK_BOOK', price: 100 };
    const req = { session: { userId: 'customer-id' } };
    const result = await controller.createJob(dto as any, req);
    expect(service.createJob).toHaveBeenCalledWith(dto, 'customer-id');
    expect(result).toEqual(mockJob);
  });

  it('should get all jobs', async () => {
    const result = await controller.getJobs();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockJob]);
  });

  it('should get job by id', async () => {
    const result = await controller.getJobById('job-id');
    expect(service.findById).toHaveBeenCalledWith('job-id');
    expect(result).toEqual(mockJob);
  });

  it('should update a job', async () => {
    const req = { session: { userId: 'customer-id' } };
    const result = await controller.updateJob('job-id', { title: 'Updated' } as any, req);
    expect(service.updateJob).toHaveBeenCalledWith('job-id', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  it('should delete a job', async () => {
    const req = { session: { userId: 'customer-id' } };
    const result = await controller.deleteJob('job-id', req);
    expect(service.deleteJob).toHaveBeenCalledWith('job-id');
    expect(result).toEqual(mockJob);
  });

  it('should complete a job', async () => {
    const req = { session: { userId: 'provider-id' } };
    const result = await controller.completeJob('job-id', req);
    expect(service.completeJob).toHaveBeenCalledWith('job-id', 'provider-id');
    expect(result.status).toBe('COMPLETED');
  });
});