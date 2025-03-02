import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from '@controllers/health.controller';

@Module({
  imports: [
    TerminusModule,
    MongooseModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {} 