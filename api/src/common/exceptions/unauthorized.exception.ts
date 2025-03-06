import { ServiceException } from './service.exception';

/**
 * Exception for authentication failures
 */
export class UnauthorizedException extends ServiceException {
  constructor(
    message: string = 'Unauthorized',
    code: string = 'UNAUTHORIZED',
    data?: any,
  ) {
    super(message, code, 401, data);
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}