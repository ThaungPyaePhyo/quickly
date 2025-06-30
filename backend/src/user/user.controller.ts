import { Controller, Get, Post,Patch, Body, Req, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { User } from 'generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async registerUser(@Body() dto: CreateUserDto) {
        await this.userService.register(dto);
        return { message: 'User registered' };
    }

    @UseGuards(SessionAuthGuard)
    @Get('me')
    async getMe(@Req() req: any): Promise<User | null> {
        return this.userService.findById(req.session.userId);
    }

    @UseGuards(SessionAuthGuard)
    @Patch('update')
    async updateUser(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.session.userId, dto);
}
}