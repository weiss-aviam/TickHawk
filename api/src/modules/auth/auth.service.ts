import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './schemas/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SignInDto } from './dtos/in/sign-in.dto';
import { SignInTokenDto } from './dtos/out/sign-in-token.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { toMs } from 'ms-typescript';
import { ForgotPasswordDto } from './dtos/in/forgot-password.dto';
import { RefreshTokenDto } from './dtos/in/refresh-token.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
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
    this.logger.debug(`Sign in attempt for email: ${customerAuth.email}`);
    
    const pass = customerAuth.password;
    const email = customerAuth.email;
    // TODO: Refactor this to use a transaction
    const session = await this.tokenModel.db.startSession();
    session.startTransaction();

    try {
      this.logger.debug('Finding user by email');
      const user = await this.userService.findOne(email);

      if (!user) {
        this.logger.warn(`User not found for email: ${email}`);
        throw new HttpException('EMAIL_PASSWORD_NOT_MATCH', 401);
      }
      
      this.logger.debug('Verifying password');
      const isMatch = await bcrypt.compare(pass, user.password);

      if (!isMatch) {
        this.logger.warn(`Password mismatch for user: ${email}`);
        throw new HttpException('EMAIL_PASSWORD_NOT_MATCH', 401);
      }

      // Create a JWT refresh token
      this.logger.debug(`Creating JWT tokens for user: ${user._id}`);
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
      this.logger.debug('Saving token to database');
      const createdToken = new this.tokenModel({
        userId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        blocked: false,
        expiration: new Date(Date.now() + toMs(refreshTokenExpiration)),
      });
      await createdToken.save();
      
      this.logger.debug(`User ${user._id} successfully signed in`);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      this.logger.error(`Sign in error: ${error.message}`, error.stack);
      await session.abortTransaction();
      session.endSession();
      
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('EMAIL_PASSWORD_NOT_MATCH', 401);
    } finally {
      session.endSession();
    }
  }

  /**
   *  Sign out a user
   * @param acessToken - JWT token to be invalidated
   */
  async signOut(accessToken: string): Promise<void> {
    try {
      this.logger.debug(`Signing out user with token: ${accessToken.substring(0, 15)}...`);
      
      const result = await this.tokenModel.deleteMany({ accessToken: accessToken });
      
      this.logger.debug(`Deleted ${result.deletedCount} token records on sign out`);
    } catch (error) {
      this.logger.error(`Error during sign out: ${error.message}`, error.stack);
      throw new HttpException('SIGN_OUT_FAILED', 500);
    }
  }

  /**
   * Refresh a JWT token
   *
   * @param refreshToken
   * @returns
   * @throws UnauthorizedException
   */
  async refresh(
    tokenDto: RefreshTokenDto,
  ): Promise<SignInTokenDto> {
    try {
      this.logger.debug(`Attempting to refresh token for access token: ${tokenDto.accessToken.substring(0, 15)}...`);
      
      const token = await this.tokenModel.findOne({
        access_token: tokenDto.accessToken,
        refresh_token: tokenDto.refreshToken,
      });

      if (!token) {
        this.logger.warn('Token not found during refresh attempt');
        throw new UnauthorizedException('INVALID_TOKEN');
      }
      
      if (token.blocked) {
        this.logger.warn(`Blocked token used for refresh: ${token._id}`);
        throw new UnauthorizedException('TOKEN_BLOCKED');
      }
      
      if (token.expiration < new Date()) {
        this.logger.warn(`Expired token used for refresh: ${token._id}, expired at ${token.expiration}`);
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }

      this.logger.debug('Verifying refresh token');
      // Extract the user ID from the token
      const refreshPayload = await this.jwtService.verifyAsync(tokenDto.refreshToken);

      if (!refreshPayload) {
        this.logger.warn('Invalid JWT payload during token refresh');
        throw new UnauthorizedException('INVALID_TOKEN');
      }

      this.logger.debug(`Creating new access token for user: ${refreshPayload.sub}`);
      const payload = { sub: refreshPayload.sub, refreshToken: tokenDto.refreshToken };
      const sign = await this.jwtService.signAsync(payload);

      this.logger.debug('Token refresh successful');
      return {
        accessToken: sign,
        refreshToken: tokenDto.refreshToken,
      };
    } catch (error) {
      this.logger.error(`Token refresh error: ${error.message}`, error.stack);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('TOKEN_REFRESH_FAILED');
    }
  }

  /**
   * Send an email to the user with a link to reset the password
   * @param email
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    try {
      this.logger.debug(`Processing forgot password request for: ${forgotPasswordDto.email}`);
      
      const user = await this.userService.findOne(forgotPasswordDto.email);

      if (!user) {
        this.logger.warn(`User not found for forgot password: ${forgotPasswordDto.email}`);
        throw new UnauthorizedException('USER_NOT_FOUND');
      }

      // Generate a JWT token
      this.logger.debug(`Generating password reset token for user: ${user._id}`);
      const token = await this.jwtService.signAsync(
        { sub: user._id, id: user._id },
        { expiresIn: '15m' },
      );

      const baseUrl = this.configService.get<string>('baseUrl');
      const url = `${baseUrl}/auth/reset-password?token=${token}`;
      this.logger.debug(`Reset URL generated: ${baseUrl}/auth/reset-password?token=***`);

      try {
        this.logger.debug(`Sending password reset email to: ${user.email}`);
        await this.mailerService.sendMail({
          to: user.email,
          from: this.configService.get<string>('email.auth.user'),
          subject: 'Reset Password',
          text: `Click on the link to reset your password: ${url}`,
          html: `<a href="${url}">Click here to reset your password</a>`,
        });
        
        this.logger.debug(`Password reset email sent successfully to: ${user.email}`);
      } catch (error) {
        this.logger.error(`Email sending failed: ${error.message}`, error.stack);
        throw new HttpException('EMAIL_SENDING_FAILED', 500);
      }
    } catch (error) {
      this.logger.error(`Forgot password error: ${error.message}`, error.stack);
      
      if (error instanceof UnauthorizedException || error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException('FORGOT_PASSWORD_FAILED', 500);
    }
  }
}
