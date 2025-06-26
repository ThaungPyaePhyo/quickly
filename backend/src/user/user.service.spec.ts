import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@mail.com',
    name: 'Test User',
    password: 'hashedpassword',
    role: 'CUSTOMER',
    rating: null,
    jobHistory: null,
    isAvailable: true,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const repoMock = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: repoMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword');
    userRepository.createUser.mockResolvedValueOnce(undefined);

    const dto = { email: 'test@mail.com', name: 'Test User', password: 'password', role: 'CUSTOMER' };
    const result = await service.register(dto as any);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@mail.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(userRepository.createUser).toHaveBeenCalledWith({
      email: 'test@mail.com',
      name: 'Test User',
      password: 'hashedpassword',
      role: 'CUSTOMER',
    });
    expect(result).toBe('User registered');
  });

  it('should throw if email already registered', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(mockUser);
    const dto = { email: 'test@mail.com', name: 'Test User', password: 'password', role: 'CUSTOMER' };
    await expect(service.register(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('should find user by id', async () => {
    const result = await service.findById('user-id');
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(result).toEqual(mockUser);
  });
});