import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  HealthCheckResult,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health status' })
  @ApiResponse({
    status: 200,
    description: 'Application health status',
  })
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('mongodb'),
    ]);
  }

  @Get('memory')
  @HealthCheck()
  @ApiOperation({ summary: 'Check memory usage' })
  @ApiResponse({
    status: 200,
    description: 'Memory usage statistics',
  })
  async checkMemory(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.checkMemoryUsage(),
    ]);
  }

  private async checkMemoryUsage(): Promise<HealthIndicatorResult> {
    const used = process.memoryUsage();
    return {
      memory: {
        status: 'up',
        heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
        heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
        rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
      },
    };
  }
} 