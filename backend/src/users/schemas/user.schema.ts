import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export interface UserDocument extends User, Document {
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
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    minLength: 3,
  })
  @Prop({
    required: true,
    minlength: 3,
    trim: true,
  })
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    minLength: 8,
  })
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: false,
  })
  isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User); 