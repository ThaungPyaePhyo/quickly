import { Test, TestingModule } from '@nestjs/testing';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { Bid } from '../../generated/prisma';

describe('BidController', () => {
  let controller: BidController;
  let service: BidService;

  const mockBid: Bid = {
    id: 'bid-id',
    jobId: 'job-id',
    providerId: 'provider-id',
    price: 150,
    note: 'Can start today',
    eta: 2,
    createdAt: new Date(),
  };

  const mockBidService = {
    createBid: jest.fn().mockResolvedValue(mockBid),
    findByJobId: jest.fn().mockResolvedValue([mockBid]),
    acceptBid: jest.fn().mockResolvedValue({ ...mockBid, status: 'ASSIGNED' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidController],
      providers: [
        { provide: BidService, useValue: mockBidService },
      ],
    }).compile();

    controller = module.get<BidController>(BidController);
    service = module.get<BidService>(BidService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a bid', async () => {
    const dto = { jobId: 'job-id', price: 150, note: 'Can start today', eta: 2 };
    const req = { session: { userId: 'provider-id' } };
    const result = await controller.createBid(dto as any, req);
    expect(service.createBid).toHaveBeenCalledWith(dto, 'provider-id');
    expect(result).toEqual(mockBid);
  });

  it('should get bids by job id', async () => {
    const result = await controller.getBidsByJob('job-id');
    expect(service.findByJobId).toHaveBeenCalledWith('job-id');
    expect(result).toEqual([mockBid]);
  });

  it('should accept a bid', async () => {
    const req = { session: { userId: 'customer-id' } };
    const result = await controller.acceptBid('bid-id', req);
    expect(service.acceptBid).toHaveBeenCalledWith('bid-id', 'customer-id');
    expect(result.status).toBe('ASSIGNED');
  });
});