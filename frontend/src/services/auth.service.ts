import axios from 'axios';
import { SignUpData, LoginData, AuthResponse } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const authService = {
  async signup(data: SignUpData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/signup`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

export default authService; 