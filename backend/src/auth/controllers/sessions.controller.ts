import { Controller, Get, Delete, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SessionsService } from '../services/sessions.service';
import { Session, SessionDocument } from '../schemas/session.schema';

@ApiTags('Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active sessions for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active sessions',
    type: [Session],
  })
  async getUserSessions(@Req() req: any): Promise<Session[]> {
    return this.sessionsService.getUserSessions(req.user._id);
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke a specific session' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Session successfully revoked',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  async revokeSession(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
  ): Promise<void> {
    await this.sessionsService.revokeSession(sessionId, req.user._id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke all sessions except the current one' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All other sessions successfully revoked',
  })
  async revokeAllSessions(@Req() req: any): Promise<void> {
    // Get the current session ID from the request
    const currentSession = await this.sessionsService.validateSession(
      req.headers.authorization?.split(' ')[1],
    );
    
    await this.sessionsService.revokeAllUserSessions(
      req.user._id,
      currentSession?.id,
    );
  }
} 