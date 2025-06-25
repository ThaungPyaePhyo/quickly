import { Controller, Post, Body, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginUserDto, @Req() req: any) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    req.session.userId = user.id;
    req.session.user = { role: user.role };
    return { message: 'Login successful', user };
  }

  @Post('logout')
  async logout(@Req() req: any) {
    req.session.destroy(() => {});
    return { message: 'Logged out' };
  }
}