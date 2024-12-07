import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger
  if (process.env.ENABLE_SWAGGER === 'true') {
    const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle('Ticketing System')
      .setDescription('The Ticketing System API description')
      .setVersion('1.0')
      .addTag('ticket')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);
  }

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
