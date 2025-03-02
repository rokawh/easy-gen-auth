import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@ApiTags('Application')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Returns welcome message',
  })
  getHello(): string {
    return 'Welcome to Easy Generator Auth API';
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get protected resource' })
  @ApiResponse({
    status: 200,
    description: 'Returns protected data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getProtected(): string {
    return 'This is a protected resource';
  }
}
