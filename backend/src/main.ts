import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');
  const isDevelopment = configService.get('app.nodeEnv') === 'development';
  
  // Use custom logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);
  
  // Security
  app.use(helmet());
  app.enableCors({
    origin: isDevelopment ? true : configService.get('app.corsOrigin'),
    credentials: true,
  });
  
  // Middleware
  app.use(compression());
  app.use(cookieParser());
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Swagger documentation
  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('Easy Generator Auth API')
      .setDescription('Authentication API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Start server
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
  
  if (isDevelopment) {
    logger.log(
      `Swagger documentation is available at: http://localhost:${port}/api`,
      'Bootstrap',
    );
  }
}

bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});
