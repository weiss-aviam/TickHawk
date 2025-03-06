import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceException } from '../exceptions';

/**
 * Exception filter that handles ServiceException and converts them to proper HTTP responses
 * This filter automatically transforms service exceptions into appropriate HTTP exceptions
 */
@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ServiceExceptionFilter.name);

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    
    // Use the suggested status code or default to 500
    const statusCode = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    
    this.logger.error(`Service exception: ${exception.message} (${exception.code}) [${statusCode}]`);

    // Format the error response with consistent structure
    const errorResponse = {
      statusCode,
      error: this.getErrorName(statusCode),
      code: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Include extra data if available
    if (exception.data) {
      Object.assign(errorResponse, { data: exception.data });
    }

    // Send the response
    response.status(statusCode).json(errorResponse);
  }

  /**
   * Get a standardized error name based on status code
   */
  private getErrorName(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return `HTTP Error ${statusCode}`;
    }
  }
}