import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/in/sign-in.dto';
import { Request } from 'express';
import { SignInTokenDto } from './dtos/out/sign-in-token.dto';
import { Public } from 'src/config/public.decorator';
import { ForgotPasswordDto } from './dtos/in/forgot-password.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshTokenDto } from './dtos/in/refresh-token.dto';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Sign in a user
   * @param signIn - The sign in object
   * @returns The sign in token
   * @throws UnauthorizedException
   */
  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 200, type: SignInTokenDto })
  async signInCustomer(@Body() signIn: SignInDto): Promise<SignInTokenDto> {
    return await this.authService.signIn(signIn);
  }

  /**
   * Sign out a user by invalidating the token
   * @param request - The request object
   * @returns HttpStatus.OK
   */
  @Get('/sign-out')
  @ApiOperation({ summary: 'Sign out a user by invalidating the token' })
  @ApiResponse({ status: 200 })
  async signOutCustomer(@Req() request: Request) {
    if (!request.headers.authorization) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }
    const token = request.headers.authorization.split(' ')[1];

    if (
      !token ||
      token === 'null' ||
      token === 'undefined' ||
      token.length <= 10
    ) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    await this.authService.signOut(token);

    return HttpStatus.OK;
  }

  // Refresh token

  /**
   * Forgot password endpoint to send an email to the user
   * @param email - The email of the user
   * @returns HttpStatus.OK
   */
  @Post('/forgot-password')
  @ApiOperation({ summary: 'Forgot password endpoint to send an email to the user' })
  @ApiResponse({ status: 202 })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return HttpStatus.ACCEPTED;
  }

  /**
   * Reset password endpoint to reset the password of the user
   * @param refreshToken 
   * @returns 
   */
  @Post('/refresh-token')
  @ApiOperation({ summary: 'Reset password endpoint to reset the password of the user' })
  @ApiResponse({ status: 200 , type: SignInTokenDto})
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Req() request: Request): Promise<SignInTokenDto> {
    refreshTokenDto.accessToken = request.headers.authorization.split(' ')[1];
    return this.authService.refresh(refreshTokenDto);
  }
}
