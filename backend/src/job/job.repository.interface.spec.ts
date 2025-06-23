import { JobRepository } from './job.repository';

describe('JobRepository', () => {
  let repository: JobRepository;

  beforeEach(() => {
    repository = new JobRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findAll should return an array', async () => {
    const result = await repository.findAll();
    expect(Array.isArray(result)).toBe(true);
  });
});