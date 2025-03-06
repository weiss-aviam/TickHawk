import { ServiceException } from './service.exception';

/**
 * Exception for conflict situations (e.g., duplicate resources)
 */
export class ConflictException extends ServiceException {
  constructor(
    message: string = 'Conflict',
    code: string = 'CONFLICT',
    data?: any,
  ) {
    super(message, code, 409, data);
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}