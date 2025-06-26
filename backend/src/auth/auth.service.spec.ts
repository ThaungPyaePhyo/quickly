import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../../generated/prisma';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;

  const mockUser = {
    id: 'user-id',
    email: 'test@mail.com',
    name: 'Test User',
    password: 'hashedpassword',
    role: Role.CUSTOMER,
    rating: null,
    jobHistory: null,
    isAvailable: true,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const repoMock = {
      findUserByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: repoMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get(AuthRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct credentials', async () => {
    authRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.validateUser('test@mail.com', 'password');
    expect(authRepository.findUserByEmail).toHaveBeenCalledWith('test@mail.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    });
  });

  it('should throw NotFoundException if user not found', async () => {
    authRepository.findUserByEmail.mockResolvedValueOnce(null);
    await expect(service.validateUser('notfound@mail.com', 'password')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if password is invalid', async () => {
    authRepository.findUserByEmail.mockResolvedValueOnce(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
    await expect(service.validateUser('test@mail.com', 'wrongpassword')).rejects.toThrow(BadRequestException);
  });
});