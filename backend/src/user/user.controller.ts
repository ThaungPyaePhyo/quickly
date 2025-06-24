import { Controller,  Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async registerUser(@Body() dto: CreateUserDto): Promise<string> {
        return this.userService.register(dto);
    }

}