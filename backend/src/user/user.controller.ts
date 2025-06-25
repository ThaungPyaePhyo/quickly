import { Controller,Get, Post, Body,Req, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { User } from 'generated/prisma';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async registerUser(@Body() dto: CreateUserDto): Promise<string> {
        return this.userService.register(dto);
    }

    @UseGuards(SessionAuthGuard)
    @Get('me')
    async getMe(@Req() req: any): Promise<User | null> {
        return this.userService.findById(req.session.userId);
    }
}