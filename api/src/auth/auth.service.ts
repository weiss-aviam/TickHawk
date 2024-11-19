import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Token } from './schemas/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

  /**
   * Sign in a user
   * @param email
   * @param pass
   * @returns
   * @throws UnauthorizedException
   */
  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    // Create a JWT refresh token
    const refreshToken = await this.jwtService.signAsync(
      { sub: user._id },
      { expiresIn: '1d' },
    );
    const payload = {
      sub: user._id,
      email: user.email,
      refreshToken: refreshToken,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    // Save the refresh token to the database
    const createdCat = new this.tokenModel({
      accessToken: accessToken,
      refresh_token: refreshToken,
      blocked: false,
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });
    await createdCat.save();

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Refresh a JWT token
   *
   * @param refreshToken
   * @returns
   * @throws UnauthorizedException
   */
  async refresh(
    accessToken: string,
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const token = await this.tokenModel.findOne({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (!token || token.blocked || token.expiration < new Date()) {
      throw new UnauthorizedException();
    }

    //Extract the user ID from the token
    const refreshPayload = await this.jwtService.verifyAsync(refreshToken);

    if (!refreshPayload) {
      throw new UnauthorizedException();
    }

    const payload = { sub: refreshPayload.sub, refreshToken: refreshToken };
    const sign = await this.jwtService.signAsync(payload);

    return {
      access_token: sign,
      refresh_token: refreshToken,
    };
  }
}
