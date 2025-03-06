import { ServiceException } from './service.exception';

/**
 * Exception for when a resource is not found
 */
export class NotFoundException extends ServiceException {
  constructor(
    message: string = 'Resource not found',
    code: string = 'NOT_FOUND',
    data?: any,
  ) {
    super(message, code, 404, data);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}