import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'generated/prisma';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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

  const mockUserService = {
    register: jest.fn().mockResolvedValue('User registered'),
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const dto = { email: 'test@mail.com', name: 'Test User', password: 'password', role: 'CUSTOMER' };
    const result = await controller.registerUser(dto as any);
    expect(service.register).toHaveBeenCalledWith(dto);
    expect(result).toBe('User registered');
  });

  it('should get current user', async () => {
    const req = { session: { userId: 'user-id' } };
    const result = await controller.getMe(req);
    expect(service.findById).toHaveBeenCalledWith('user-id');
    expect(result).toEqual(mockUser);
  });
});