export interface SignUpData {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  companySize: string;
  agreeToEula: boolean;
  agreeToMarketing: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  countryCode: string;
  companySize: string;
  agreeToEula: boolean;
  agreeToMarketing: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
} 