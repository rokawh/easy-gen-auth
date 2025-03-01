export interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
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