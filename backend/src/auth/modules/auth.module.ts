import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from './modules/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Session, SessionSchema } from './schemas/session.schema';
import { SessionsService } from './services/sessions.service';
import { SessionsController } from './controllers/sessions.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwtExpiration'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [AuthController, SessionsController],
  providers: [AuthService, JwtStrategy, SessionsService],
  exports: [JwtStrategy, PassportModule, SessionsService],
})
export class AuthModule {} 