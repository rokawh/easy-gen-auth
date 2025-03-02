import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { AppModule } from '../src/auth/modules/app.module';
import { CreateUserDto } from '../src/auth/dto/create-user.dto';
import { LoginDto } from '../src/auth/dto/login.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let authToken: string;
  let sessionId: string;

  const testUser: CreateUserDto = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'Test123!@#',
    phoneNumber: '1234567890',
    countryCode: '+1',
    companySize: '1-99 employees',
    agreeToEula: true,
    agreeToMarketing: false,
  };

  const loginDto: LoginDto = {
    email: testUser.email,
    password: testUser.password,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    await app.init();

    dbConnection = moduleFixture.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    // Clean up the test database
    await dbConnection.dropDatabase();
    await app.close();
  });

  describe('Authentication Flow', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.token).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user.password).toBeUndefined();
        });
    });

    it('should not register a user with existing email', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(409);
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.token).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe(testUser.email);
          authToken = res.body.token;
        });
    });

    it('should not login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...loginDto, password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('Session Management', () => {
    it('should get active sessions', () => {
      return request(app.getHttpServer())
        .get('/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].isActive).toBe(true);
          sessionId = res.body[0].id;
        });
    });

    it('should revoke a specific session', () => {
      return request(app.getHttpServer())
        .delete(`/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should revoke all other sessions', () => {
      return request(app.getHttpServer())
        .delete('/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });

  describe('Protected Routes', () => {
    it('should access protected route with valid token', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should not access protected route without token', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .expect(401);
    });

    it('should not access protected route with invalid token', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
}); 