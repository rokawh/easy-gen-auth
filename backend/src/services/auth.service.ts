import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '@services/users.service';
import { CreateUserDto } from '@dto/create-user.dto';
import { LoginDto } from '@dto/login.dto';
import { User, UserDocument } from '@schemas/user.schema';
import { SessionsService } from '@services/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
  ) {}

  async signup(
    createUserDto: CreateUserDto,
    req: Request,
  ): Promise<{ token: string; user: Partial<User> }> {
    const user = (await this.usersService.create(
      createUserDto,
    )) as UserDocument;
    const token = this.generateToken(user);

    // Create a new session
    await this.sessionsService.createSession(
      user._id.toString(),
      token,
      req.headers['user-agent'] || 'Unknown',
      req.ip || req.socket.remoteAddress || 'Unknown',
    );

    const userObj = user.toObject();
    delete userObj.password;

    return {
      token,
      user: userObj,
    };
  }

  async login(
    loginDto: LoginDto,
    req: Request,
  ): Promise<{ token: string; user: Partial<User> }> {
    const { email, password } = loginDto;
    const user = (await this.usersService.findByEmail(email)) as UserDocument;

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    // Create a new session
    await this.sessionsService.createSession(
      user._id.toString(),
      token,
      req.headers['user-agent'] || 'Unknown',
      req.ip || req.socket.remoteAddress || 'Unknown',
    );

    const userObj = user.toObject();
    delete userObj.password;

    return {
      token,
      user: userObj,
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = { email: user.email, sub: user._id.toString() };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
      const session = await this.sessionsService.validateSession(token);
      return !!session;
    } catch {
      return false;
    }
  }
}
