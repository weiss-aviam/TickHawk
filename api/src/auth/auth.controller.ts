import { Body, Controller, Get, HttpStatus, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { Request } from 'express';
import { SignInTokenDto } from './dtos/sign-in-token.dto';

@Controller('auth') 
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/sign-in')
    async signInCustomer(@Body() signIn: SignInDto): Promise<SignInTokenDto> {
        return await this.authService.signIn(signIn);
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
        
        await this.authService.signOut(token);
        
        return HttpStatus.OK;
    }

    // Refresh token

    // Forgot password
    @Post('/forgot-password')
    async forgotPassword(@Body() email: string) {
        return await this.authService.forgotPassword(email);
    }

}
