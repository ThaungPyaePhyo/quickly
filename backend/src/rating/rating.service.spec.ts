import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { RatingRepository } from './rating.repository';
import { PrismaService } from '../prisma.service';

describe('RatingService', () => {
  let service: RatingService;
  let repository: RatingRepository;

  const mockRatingRepository = {
    createRating: jest.fn(),
    findByJob: jest.fn(),
    findByProvider: jest.fn(),
    findByJobAndProvider: jest.fn(),
  };

  const mockPrismaService = {
    job: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'job1',
        customerId: 'customer1',
        providerId: 'provider1',
        status: 'COMPLETED',
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: RatingRepository, useValue: mockRatingRepository },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
    repository = module.get<RatingRepository>(RatingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.createRating when rateProvider is called', async () => {
    mockRatingRepository.findByJobAndProvider.mockResolvedValue(null);
    mockRatingRepository.createRating.mockResolvedValue({
      id: '1',
      score: 5,
      comment: 'Great!',
      jobId: 'job1',
      providerId: 'provider1',
      createdAt: new Date(),
    });
    const result = await service.rateProvider('job1', 'customer1', 5, 'Great!');
    expect(mockRatingRepository.createRating).toHaveBeenCalledWith({
      score: 5,
      comment: 'Great!',
      providerId: 'provider1',
      jobId: 'job1',
    });
    expect(result).toBeDefined();
  });

  it('should call repository.findByJob when getJobRating is called', async () => {
    mockRatingRepository.findByJob.mockResolvedValue([
      { id: '1', score: 5, comment: 'Great!', jobId: 'job1', providerId: 'provider1', createdAt: new Date() },
    ]);
    await service.getJobRating('job1');
    expect(mockRatingRepository.findByJob).toHaveBeenCalledWith('job1');
  });

  it('should call repository.findByProvider when getProviderRatings is called', async () => {
    mockRatingRepository.findByProvider.mockResolvedValue([
      { id: '1', score: 5, comment: 'Great!', jobId: 'job1', providerId: 'provider1', createdAt: new Date() },
    ]);
    await service.getProviderRatings('provider1');
    expect(mockRatingRepository.findByProvider).toHaveBeenCalledWith('provider1');
  });
});