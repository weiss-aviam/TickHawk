import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Configure logging level
  const logLevels = ['error', 'warn', 'log', 'debug', 'verbose'];
  const logLevel = process.env.LOG_LEVEL || 'log';
  
  // Validate log level
  if (!logLevels.includes(logLevel)) {
    console.warn(`Invalid LOG_LEVEL: ${logLevel}. Using 'log' instead.`);
  }
  
  // Create app with configured logging
  const app = await NestFactory.create(AppModule, { 
    cors: true,
    logger: logLevels.slice(0, logLevels.indexOf(logLevel) + 1),
  });

  // Get logger instance for bootstrap function
  const logger = new Logger('Bootstrap');

  // Swagger
  if (process.env.ENABLE_SWAGGER === 'true') {
    logger.log('Swagger documentation enabled');
    const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle('TickHawk API')
      .setDescription('TickHawk Ticket Management System API')
      .setVersion('1.0')
      .addTag('auth')
      .addTag('user')
      .addTag('company')
      .addTag('department')
      .addTag('ticket')
      .addTag('file')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
