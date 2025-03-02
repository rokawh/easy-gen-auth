import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Remember me option',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
} 