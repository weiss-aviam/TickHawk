import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Global exception filter to handle all unhandled exceptions
 * This ensures a consistent error response format across the API
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Get status code and message
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorName = 'Internal Server Error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();
      
      // Check if the error response is an object with a message
      if (typeof errorResponse === 'object' && 'message' in errorResponse) {
        message = errorResponse.message as any;
        
        // If there's an error code in the response, use it
        if ('code' in errorResponse) {
          errorCode = errorResponse.code as any;
        }
      } else if (typeof errorResponse === 'string') {
        message = errorResponse;
      }
      
      errorName = exception.name || this.getErrorName(statusCode);
    } else if (exception instanceof Error) {
      message = exception.message;
      errorName = exception.name || 'Error';
    }

    // Log the error with details
    this.logger.error(
      `Exception: ${errorName} - ${message} [${statusCode}] - ${request.method} ${request.url}`,
      exception.stack
    );

    // Format the error response
    const responseBody = {
      statusCode,
      error: errorName,
      message,
      code: errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Send the response
    response.status(statusCode).json(responseBody);
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