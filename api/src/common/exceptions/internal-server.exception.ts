import { ServiceException } from './service.exception';

/**
 * Exception for internal server errors
 */
export class InternalServerException extends ServiceException {
  constructor(
    message: string = 'Internal server error',
    code: string = 'INTERNAL_SERVER_ERROR',
    data?: any,
  ) {
    super(message, code, 500, data);
    Object.setPrototypeOf(this, InternalServerException.prototype);
  }
}