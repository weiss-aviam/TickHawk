import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './schemas/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dtos/sign-in.dto';

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
    customerAuth: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const pass = customerAuth.password;
    const email = customerAuth.email;

    const user = await this.userService.findOne(email);

    if (!user) {
      throw new HttpException('EMAIL_PASSWORD_NOT_MATCH', 401);
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new HttpException('EMAIL_PASSWORD_NOT_MATCH', 401);
    }

    // Create a JWT refresh token
    const refreshToken = await this.jwtService.signAsync(
      { sub: user._id, id: user._id },
      { expiresIn: '1d' },
    );
    const payload = {
      sub: user._id,
      id: user._id,
      email: user.email,
      role: user.role,
      departmentIds: user.departmentIds,
      companyId: user.companyId,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    // Save the refresh token to the database
    const createdCat = new this.tokenModel({
      userId: user._id,
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
   *  Sign out a user
   * @param acessToken - JWT token to be invalidated
   */
  async signOut(acessToken: string): Promise<void> {
    await this.tokenModel.deleteMany({ accessToken: acessToken });
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
      throw new UnauthorizedException("INVALID_TOKEN");
    }

    //Extract the user ID from the token
    const refreshPayload = await this.jwtService.verifyAsync(refreshToken);

    if (!refreshPayload) {
      throw new UnauthorizedException("INVALID_TOKEN");
    }

    const payload = { sub: refreshPayload.sub, refreshToken: refreshToken };
    const sign = await this.jwtService.signAsync(payload);

    return {
      access_token: sign,
      refresh_token: refreshToken,
    };
  }
}
