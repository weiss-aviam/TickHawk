import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './schemas/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CustomerAuthDto } from './dtos/customer-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

  /**
   * Sign in a agent
   * @param email
   * @param pass
   * @returns
   * @throws UnauthorizedException
   */
  async signIn(
    customerAuth: CustomerAuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const pass = customerAuth.password;
    const email = customerAuth.email;

    const agent = await this.userService.findOne(email);

    if (!agent) {
      throw new HttpException('EMAIL_PASSWORD_NOT_MATCH', 401);
    }

    const isMatch = await bcrypt.compare(pass, agent.password);
    if (!isMatch) {
      throw new HttpException('EMAIL_PASSWORD_NOT_MATCH', 401);
    }

    // Create a JWT refresh token
    const refreshToken = await this.jwtService.signAsync(
      { sub: agent._id },
      { expiresIn: '1d' },
    );
    const payload = {
      sub: agent._id,
      email: agent.email,
      refreshToken: refreshToken,
      role: agent.role,
      departmentIds: agent.departmentIds,
      companyId: agent.companyId,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    // Save the refresh token to the database
    const createdCat = new this.tokenModel({
      accessToken: accessToken,
      refreshToken: refreshToken,
      blocked: false,
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });
    await createdCat.save();

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
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
