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
    trim: true,
    lowercase: true
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
    trim: true
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

  @ApiProperty({
    description: 'Phone number',
    example: '1234567890',
  })
  @Prop({
    required: true,
    trim: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Country code for phone number',
    example: '+1',
  })
  @Prop({
    required: true,
    trim: true,
  })
  countryCode: string;

  @ApiProperty({
    description: 'Company size',
    example: '1-99 employees',
  })
  @Prop({
    required: true,
  })
  companySize: string;

  @ApiProperty({
    description: 'Agreement to EULA',
    example: true,
  })
  @Prop({
    required: true,
    default: false,
  })
  agreeToEula: boolean;

  @ApiProperty({
    description: 'Agreement to marketing communications',
    example: false,
  })
  @Prop({
    default: false,
  })
  agreeToMarketing: boolean;

  @Prop({
    default: false,
  })
  isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add compound indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1 });
UserSchema.index({ createdAt: -1 }); 