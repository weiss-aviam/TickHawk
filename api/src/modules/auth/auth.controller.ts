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
import { SignInDto } from './dtos/sign-in.dto';
import { Request } from 'express';
import { SignInTokenDto } from './dtos/sign-in-token.dto';
import { Public } from 'src/config/public.decorator';

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
  async signInCustomer(@Body() signIn: SignInDto): Promise<SignInTokenDto> {
    return await this.authService.signIn(signIn);
  }

  /**
   * Sign out a user by invalidating the token
   * @param request - The request object
   * @returns HttpStatus.OK
   */
  @Get('/sign-out')
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
  async forgotPassword(@Body() email: string) {
    await this.authService.forgotPassword(email);
    return HttpStatus.OK;
  }

  @Post('/refresh-token')
  async refreshToken(@Body() refreshToken: string) {
    return "123123123"
  }
}
