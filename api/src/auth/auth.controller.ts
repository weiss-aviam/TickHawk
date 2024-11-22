import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { Request } from 'express';

@Controller('auth') 
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/sign-in')
    async signInCustomer(@Body() signIn: SignInDto) {
        return this.authService.signIn(signIn);
    }

    @Get('/sign-out')
    async signOutCustomer(@Req() request: Request) {
        if (!request.headers.authorization) {
            throw new UnauthorizedException('INVALID_TOKEN');
        }
        const token = request.headers.authorization.split(' ')[1];

        if (!token || token === 'null' || token === 'undefined' || token.length <= 10) {
            throw new UnauthorizedException('INVALID_TOKEN');
        }

        return this.authService.signOut(token);
    }

}
