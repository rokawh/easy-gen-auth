import { Controller, Post, Body, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '@services/auth.service';
import { CreateUserDto } from '@dto/create-user.dto';
import { LoginDto } from '@dto/login.dto';
import { CustomThrottlerGuard } from '@guards/throttler.guard';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(CustomThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Too many requests, please try again later',
  })
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ) {
    return this.authService.signup(createUserDto, req);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Too many requests, please try again later',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ) {
    return this.authService.login(loginDto, req);
  }
} 