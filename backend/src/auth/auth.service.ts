import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async validateUser(email: string, password: string): Promise<{ id: string; email: string; name: string; role: string }> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new BadRequestException('Invalid credentials');
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}