import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: CategoryRepository;

  const mockCategories = [
    { id: '1', name: 'Plumbing' },
    { id: '2', name: 'Electrical' },
  ];

  const mockCategoryRepository = {
    findAll: jest.fn().mockResolvedValue(mockCategories),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryRepository, useValue: mockCategoryRepository },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all categories', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockCategories);
    expect(repository.findAll).toHaveBeenCalled();
  });
});