import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches, IsBoolean, IsNotEmpty } from 'class-validator';

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

  @ApiProperty({
    description: 'Phone number',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Country code for phone number',
    example: '+1',
  })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({
    description: 'Company size',
    example: '1-99 employees',
  })
  @IsString()
  @IsNotEmpty()
  companySize: string;

  @ApiProperty({
    description: 'Agreement to EULA',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  agreeToEula: boolean;

  @ApiProperty({
    description: 'Agreement to marketing communications',
    example: false,
  })
  @IsBoolean()
  agreeToMarketing: boolean;
} 