import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    {
      message:
        'Password must contain at least one letter, one number, and one special character',
    },
  )
  password: string;
} 