/**
 * Base exception class for service layer errors
 * This class should be used in services instead of HttpException
 */
export class ServiceException extends Error {
  /**
   * Error code to identify the type of error
   * This can be used to map to HTTP status codes in controllers
   */
  readonly code: string;

  /**
   * Optional status code suggestion for the controller layer
   */
  readonly statusCode?: number;

  /**
   * Optional additional data to provide context about the error
   */
  readonly data?: any;

  /**
   * Create a new ServiceException
   * @param message Error message
   * @param code Error code
   * @param statusCode Suggested HTTP status code
   * @param data Additional error data
   */
  constructor(
    message: string,
    code: string,
    statusCode?: number,
    data?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.data = data;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ServiceException.prototype);
  }

  /**
   * Get a plain JSON representation of the exception
   * Useful for serializing the error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      data: this.data,
    };
  }
}