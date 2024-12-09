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
import { SignInDto } from './dtos/in/sign-in.dto';
import { SignInTokenDto } from './dtos/out/sign-in-token.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { toMs } from 'ms-typescript';
import { ForgotPasswordDto } from './dtos/in/forgot-password.dto';
import { RefreshTokenDto } from './dtos/in/refresh-token.dto';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sign in a agent
   * @param email
   * @param pass
   * @returns
   * @throws UnauthorizedException
   */
  async signIn(customerAuth: SignInDto): Promise<SignInTokenDto> {
    const pass = customerAuth.password;
    const email = customerAuth.email;
    // TODO: REfactor this to use a transaction
    const session = await this.tokenModel.db.startSession();
    session.startTransaction();

    try {
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

      const refreshTokenExpiration = this.configService.get<string>(
        'jwt.refreshTokenExpiration',
      );

      // Save the refresh token to the database
      const createdToken = new this.tokenModel({
        userId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        blocked: false,
        expiration: new Date(Date.now() + toMs(refreshTokenExpiration)),
      });
      await createdToken.save();
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw new HttpException('EMAIL_PASSWORD_NOT_MATCH', 401);
    } finally {
      session.endSession();
    }
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
    tokenDto : RefreshTokenDto,
  ): Promise<SignInTokenDto> {
    const token = await this.tokenModel.findOne({
      access_token: tokenDto.accessToken,
      refresh_token: tokenDto.refreshToken,
    });

    if (!token || token.blocked || token.expiration < new Date()) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    //Extract the user ID from the token
    const refreshPayload = await this.jwtService.verifyAsync(tokenDto.refreshToken);

    if (!refreshPayload) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    const payload = { sub: refreshPayload.sub, refreshToken: tokenDto.refreshToken };
    const sign = await this.jwtService.signAsync(payload);

    return {
      accessToken: sign,
      refreshToken: tokenDto.refreshToken,
    };
  }

  /**
   * Send an email to the user with a link to reset the password
   * @param email
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOne(forgotPasswordDto.email);

    if (!user) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    // Generate a JWT token
    const token = await this.jwtService.signAsync(
      { sub: user._id, id: user._id },
      { expiresIn: '15m' },
    );

    const url = `${this.configService.get<string>(
      'baseUrl',
    )}/auth/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: this.configService.get<string>('email.auth.user'),
        subject: 'Reset Password',
        text: `Click on the link to reset your password: ${url}`,
        html: `<a href="${url}">Click here to reset your password</a>`,
      });
    } catch (e) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
  }
}
