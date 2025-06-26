import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = {
    id: 'user-id',
    email: 'test@mail.com',
    name: 'Test User',
    role: 'CUSTOMER',
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login and set session', async () => {
    const req: any = { session: {} };
    const dto = { email: 'test@mail.com', password: 'password' };
    const result = await controller.login(dto, req);
    expect(service.validateUser).toHaveBeenCalledWith('test@mail.com', 'password');
    expect(req.session.userId).toBe(mockUser.id);
    expect(req.session.user).toEqual({ role: mockUser.role });
    expect(result).toEqual({ message: 'Login successful', user: mockUser });
  });

  it('should logout and destroy session', async () => {
    const destroyMock = jest.fn((cb) => cb());
    const req: any = { session: { destroy: destroyMock } };
    const result = await controller.logout(req);
    expect(destroyMock).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Logged out' });
  });
});