import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from '../schemas/session.schema';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createSession(
    userId: string,
    token: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<Session> {
    const expiresIn = this.configService.get<string>('auth.jwtExpiration') || '1d';
    const expiresAt = new Date();
    
    // Convert expiration time to milliseconds and add to current time
    const matches = expiresIn.match(/^(\d+)([dhms])$/);
    if (matches) {
      const [, amount, unit] = matches;
      const multipliers: Record<string, number> = {
        'd': 24 * 60 * 60 * 1000, // days to ms
        'h': 60 * 60 * 1000,      // hours to ms
        'm': 60 * 1000,           // minutes to ms
        's': 1000,                // seconds to ms
      };
      
      const multiplier = multipliers[unit];
      if (multiplier) {
        expiresAt.setTime(expiresAt.getTime() + parseInt(amount) * multiplier);
      } else {
        // Default to 1 day if invalid unit
        expiresAt.setTime(expiresAt.getTime() + 24 * 60 * 60 * 1000);
      }
    } else {
      // Default to 1 day if invalid format
      expiresAt.setTime(expiresAt.getTime() + 24 * 60 * 60 * 1000);
    }

    const session = new this.sessionModel({
      userId: new Types.ObjectId(userId),
      token,
      userAgent,
      ipAddress,
      expiresAt,
    });

    return session.save();
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return this.sessionModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
        expiresAt: { $gt: new Date() },
      })
      .sort({ lastActivity: -1 })
      .exec();
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.sessionModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(sessionId),
        userId: new Types.ObjectId(userId),
      },
      { isActive: false },
      { new: true },
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }
  }

  async revokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
    const query: any = {
      userId: new Types.ObjectId(userId),
      isActive: true,
    };

    if (exceptSessionId) {
      query._id = { $ne: new Types.ObjectId(exceptSessionId) };
    }

    await this.sessionModel.updateMany(query, { isActive: false });
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.sessionModel.findByIdAndUpdate(
      sessionId,
      { lastActivity: new Date() },
      { new: true },
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredSessions() {
    try {
      const result = await this.cleanupExpiredSessions();
      console.log('Cleaned up expired sessions:', result);
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }

  async cleanupExpiredSessions(): Promise<{ deactivated: number }> {
    const result = await this.sessionModel.updateMany(
      {
        isActive: true,
        expiresAt: { $lte: new Date() },
      },
      { 
        isActive: false,
        lastActivity: new Date(),
      },
    );

    return { deactivated: result.modifiedCount };
  }

  async validateSession(token: string): Promise<SessionDocument | null> {
    const session = await this.sessionModel.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (session) {
      // Update last activity timestamp
      await this.updateSessionActivity(session._id.toString());
    }

    return session;
  }
} 