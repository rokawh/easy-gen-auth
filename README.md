# Easy Generator Authentication Module

A full-stack authentication module built with React, NestJS, and MongoDB. This project implements a secure authentication system with features like sign-up, sign-in, and protected routes.

## Features

- User registration and authentication
- JWT-based authentication
- Form validation
- Protected routes
- Modern UI with responsive design
- API documentation with Swagger
- Secure password handling
- MongoDB integration
- Rate limiting
- Health monitoring
- Docker containerization
- Database indexing for performance
- Session management with automatic cleanup

## Tech Stack

### Frontend
- React 18 with TypeScript
- Mantine UI Framework (@mantine/core, @mantine/form, @mantine/hooks)
- React Router for navigation
- TailwindCSS with tailwind-merge for styling
- Axios for API calls
- React Query (@tanstack/react-query) for data fetching
- Tabler Icons for UI icons
- Emotion for CSS-in-JS

### Backend
- NestJS 11 with TypeScript
- MongoDB with Mongoose ODM
- JWT for authentication (with @nestjs/jwt)
- Passport.js for authentication strategies
- Class Validator & Class Transformer for DTO validation
- Swagger/OpenAPI for documentation
- Helmet for security headers
- Winston & nest-winston for logging
- Throttler for rate limiting
- Terminus for health checks
- Compression for response optimization
- Cookie Parser for cookie handling
- Joi for configuration validation

## Prerequisites

Before running the application, make sure you have one of the following:
- Docker and Docker Compose installed (recommended)
OR
- Node.js (v20 or later)
- MongoDB (v4.4 or later)
- npm or yarn

## Project Structure

```
easy-generator-auth/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Root component
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── Dockerfile          # Frontend Docker configuration
│   └── nginx.conf          # Nginx configuration for production
│
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── guards/        # Authentication guards
│   │   ├── modules/       # Feature modules
│   │   ├── schemas/       # MongoDB schemas
│   │   ├── services/      # Business logic
│   │   ├── strategies/    # Authentication strategies
│   │   └── test/         # Test files
│   ├── Dockerfile         # Backend Docker configuration
│   └── .env.example       # Environment variables template
│
├── docker-compose.yml      # Docker compose configuration
└── README.md              # Project documentation
```

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd easy-generator-auth
```

2. Build and run the containers:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api

## Manual Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd easy-generator-auth
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Backend (`.env`):
```bash
# Application
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/easy-generator

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=15d

# Security
CORS_ORIGIN=http://localhost:80

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

Frontend (`.env`):
```bash
VITE_API_URL=http://localhost:3000
```

## Running the Application

### Using Docker
```bash
docker-compose up -d
```

### Manual Start
1. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

2. Start the backend server:
```bash
cd backend
npm run start:dev
```

The backend server will start on http://localhost:3000
API documentation will be available at http://localhost:3000/api

3. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The frontend application will start on http://localhost:80

## API Documentation

Once the backend is running, you can access the Swagger API documentation at:
http://localhost:3000/api

Available endpoints:
- POST /auth/signup - Register a new user
- POST /auth/login - Authenticate a user
- GET /protected - Example protected route
- GET /sessions - Get user's active sessions
- DELETE /sessions - Revoke all sessions except current
- DELETE /sessions/:id - Revoke specific session
- GET /health - Check application health
- GET /health/memory - Check memory usage

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- HTTP-only cookies
- CORS protection
- Helmet security headers
- Input validation
- Rate limiting
- Session management with automatic cleanup
- Automatic inactive session cleanup

## Health Monitoring

The application includes health check endpoints:
- GET /health - Overall application health
- GET /health/memory - Memory usage statistics

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Default: 10 requests per minute per IP
- Configurable via environment variables:
  - THROTTLE_TTL: Time window in seconds
  - THROTTLE_LIMIT: Number of requests allowed

## Testing

Run backend tests:
```bash
cd backend
npm run test
```

Run frontend tests:
```bash
cd frontend
npm run test
```

## Development

### Backend Development

The backend is structured following NestJS best practices:
- `src/controllers` - Route controllers for handling HTTP requests
- `src/modules` - Feature modules (Auth, Users, Health, etc.)
- `src/services` - Business logic implementation
- `src/guards` - Authentication and authorization guards
- `src/dto` - Data Transfer Objects for request validation
- `src/schemas` - MongoDB schemas and models
- `src/strategies` - Authentication strategies
- `src/config` - Configuration and environment setup
- `src/test` - Test files and test utilities

### Frontend Development

The frontend follows React best practices:
- `src/components` - Reusable UI components
- `src/pages` - Page components and routing
- `src/services` - API services and data fetching
- `src/hooks` - Custom React hooks
- `src/types` - TypeScript type definitions
- `src/assets` - Static assets (images, fonts, etc.)
- `src/App.tsx` - Root application component
- `src/main.tsx` - Application entry point
- `src/index.css` - Global styles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
