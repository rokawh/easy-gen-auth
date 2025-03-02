import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export interface SessionDocument extends Session, Document {
  _id: Types.ObjectId;
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Session {
  @ApiProperty({
    description: 'User ID associated with this session',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'JWT token for this session',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Prop({
    required: true,
  })
  token: string;

  @ApiProperty({
    description: 'Device information',
    example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  })
  @Prop({
    required: true,
  })
  userAgent: string;

  @ApiProperty({
    description: 'IP address of the client',
    example: '192.168.1.1',
  })
  @Prop({
    required: true,
  })
  ipAddress: string;

  @ApiProperty({
    description: 'Last activity timestamp',
    example: '2024-03-01T12:00:00.000Z',
  })
  @Prop({
    default: Date.now,
  })
  lastActivity: Date;

  @ApiProperty({
    description: 'Session expiry timestamp',
    example: '2024-03-02T12:00:00.000Z',
  })
  @Prop({
    required: true,
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Whether the session is active',
    example: true,
  })
  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session); 