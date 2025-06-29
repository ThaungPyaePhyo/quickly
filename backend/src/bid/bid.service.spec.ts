import { Test, TestingModule } from '@nestjs/testing';
import { BidService } from './bid.service';
import { BidRepository } from './bid.repository';
import { JobRepository } from '../job/job.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Bid, Job, JobStatus } from '../../generated/prisma';

describe('BidService', () => {
  let service: BidService;
  let bidRepository: jest.Mocked<BidRepository>;
  let jobRepository: jest.Mocked<JobRepository>;

  const mockBid: Bid = {
    id: 'bid-id',
    jobId: 'job-id',
    providerId: 'provider-id',
    price: 150,
    note: 'Can start today',
    eta: 2,
    createdAt: new Date(),
  };

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidService,
        { provide: BidRepository, useValue: {
          createBid: jest.fn().mockResolvedValue(mockBid),
          findByJobId: jest.fn().mockResolvedValue([mockBid]),
          findById: jest.fn().mockResolvedValue(mockBid),
        }},
        { provide: JobRepository, useValue: {
          findById: jest.fn().mockResolvedValue(mockJob),
          updateJob: jest.fn().mockResolvedValue({ ...mockJob, providerId: mockBid.providerId, status: JobStatus.ASSIGNED, acceptPrice: mockBid.price }),
        }},
      ],
    }).compile();

    service = module.get<BidService>(BidService);
    bidRepository = module.get(BidRepository);
    jobRepository = module.get(JobRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a bid', async () => {
    const dto = { jobId: 'job-id', price: 150, note: 'Can start today', eta: 2 };
    const result = await service.createBid(dto as any, 'provider-id');
    expect(bidRepository.createBid).toHaveBeenCalledWith({ ...dto, providerId: 'provider-id' });
    expect(result).toEqual(mockBid);
  });

  it('should find bids by job id', async () => {
    const result = await service.findByJobId('job-id');
    expect(bidRepository.findByJobId).toHaveBeenCalledWith('job-id');
    expect(result).toEqual([mockBid]);
  });

  describe('acceptBid', () => {
    it('should accept a bid and assign provider', async () => {
      const result = await service.acceptBid('bid-id', 'customer-id');
      expect(bidRepository.findById).toHaveBeenCalledWith('bid-id');
      expect(jobRepository.findById).toHaveBeenCalledWith('job-id');
      expect(jobRepository.updateJob).toHaveBeenCalledWith('job-id', {
        providerId: mockBid.providerId,
        status: JobStatus.ASSIGNED,
        acceptPrice: mockBid.price,
      });
      expect(result.status).toBe(JobStatus.ASSIGNED);
      expect(result.providerId).toBe(mockBid.providerId);
    });

    it('should throw NotFoundException if bid not found', async () => {
      bidRepository.findById.mockResolvedValueOnce(null);
      await expect(service.acceptBid('bad-bid', 'customer-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if job not found', async () => {
      bidRepository.findById.mockResolvedValueOnce(mockBid);
      jobRepository.findById.mockResolvedValueOnce(null);
      await expect(service.acceptBid('bid-id', 'customer-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if customer does not own job', async () => {
      bidRepository.findById.mockResolvedValueOnce(mockBid);
      jobRepository.findById.mockResolvedValueOnce({ ...mockJob, customerId: 'other-customer' });
      await expect(service.acceptBid('bid-id', 'customer-id')).rejects.toThrow(ForbiddenException);
    });
  });
});