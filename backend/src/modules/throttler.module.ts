import { Module } from '@nestjs/common';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<ThrottlerModuleOptions> => ({
        throttlers: [
          {
            ttl: configService.get<number>('app.throttle.ttl', 60),
            limit: configService.get<number>('app.throttle.limit', 10),
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class ThrottlerModule {}
