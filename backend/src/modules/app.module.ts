import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '@controllers/app.controller';
import { AuthModule } from '@modules/auth.module';
import { UsersModule } from '@modules/users.module';
import { CommonModule } from '@modules/common.module';
import { ThrottlerModule } from '@modules/throttler.module';
import { HealthModule } from '@modules/health.module';
import { MongoError } from 'mongodb';
import {
  configValidationSchema,
  appConfig,
  databaseConfig,
  authConfig,
} from '@config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('MongoDB connected successfully');
          });
          connection.on('error', (error: MongoError) => {
            console.error('MongoDB connection error:', error);
          });
          connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
          });
          return connection;
        },
        retryAttempts: 5,
        retryDelay: 3000,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
        maxPoolSize: 10,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule,
    CommonModule,
    AuthModule,
    UsersModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
