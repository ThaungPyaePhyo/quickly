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
    const req = { session: { destroy: (cb: Function) => cb() } };
    const res = {
      clearCookie: jest.fn(),
      json: jest.fn(),
    };
    await controller.logout(req, res as any);
    expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
    expect(res.json).toHaveBeenCalledWith({ message: 'Logged out' });
  });
});