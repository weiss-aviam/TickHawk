import { ServiceException } from './service.exception';

/**
 * Exception for invalid input or requests
 */
export class BadRequestException extends ServiceException {
  constructor(
    message: string = 'Bad request',
    code: string = 'BAD_REQUEST',
    data?: any,
  ) {
    super(message, code, 400, data);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}