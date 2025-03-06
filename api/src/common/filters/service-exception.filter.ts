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
 */
@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ServiceExceptionFilter.name);

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Use the suggested status code or default to 500
    const statusCode = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    
    this.logger.error(`Service exception: ${exception.message} (${exception.code})`);

    // Format the error response
    const errorResponse = {
      statusCode,
      code: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };

    // Include extra data if available
    if (exception.data) {
      Object.assign(errorResponse, { data: exception.data });
    }

    // Send the response
    response.status(statusCode).json(errorResponse);
  }
}