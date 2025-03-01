import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.usersService.create(createUserDto) as UserDocument;
    const token = this.generateToken(user);

    const userObj = user.toObject();
    delete userObj.password;
    
    return {
      token,
      user: userObj,
    };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email) as UserDocument;

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
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
} 