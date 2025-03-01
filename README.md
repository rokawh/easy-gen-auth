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

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- TailwindCSS for styling
- Axios for API calls
- React Hook Form for form handling

### Backend
- NestJS with TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Class Validator for DTO validation
- Swagger/OpenAPI for documentation
- Helmet for security headers

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (v18 or later)
- MongoDB (v4.4 or later)
- npm or yarn

## Project Structure

```
easy-generator-auth/
├── frontend/     # React TypeScript application
└── backend/      # NestJS application
```

## Installation & Setup

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

Backend (.env):
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/easy-generator-auth
JWT_SECRET=your-super-secret-key-change-in-production
```

Frontend (.env):
```
VITE_API_URL=http://localhost:3000
```

## Running the Application

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

The frontend application will start on http://localhost:5173

## API Documentation

Once the backend is running, you can access the Swagger API documentation at:
http://localhost:3000/api

Available endpoints:
- POST /auth/signup - Register a new user
- POST /auth/login - Authenticate a user
- GET /protected - Example protected route

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

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- HTTP-only cookies
- CORS protection
- Helmet security headers
- Input validation
- Rate limiting

## Development

### Backend Development

The backend is structured following NestJS best practices:
- `src/auth` - Authentication module
- `src/users` - User management module
- `src/common` - Shared utilities and middleware

### Frontend Development

The frontend follows React best practices:
- `src/components` - Reusable UI components
- `src/pages` - Page components
- `src/hooks` - Custom React hooks
- `src/services` - API services
- `src/types` - TypeScript type definitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository. 