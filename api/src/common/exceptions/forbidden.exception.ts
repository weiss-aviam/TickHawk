import { ServiceException } from './service.exception';

/**
 * Exception for authorization failures (permission denied)
 */
export class ForbiddenException extends ServiceException {
  constructor(
    message: string = 'Forbidden',
    code: string = 'FORBIDDEN',
    data?: any,
  ) {
    super(message, code, 403, data);
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}