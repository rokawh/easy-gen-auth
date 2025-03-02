import axiosInstance from '@services/axios.interceptor';

import { SignUpData, LoginData, AuthResponse, Session } from '@/types/auth';

const authService = {
  async signup(data: SignUpData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
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
  },

  // New methods for session management
  async getSessions(): Promise<Session[]> {
    const response = await axiosInstance.get('/sessions');
    return response.data;
  },

  async revokeSession(sessionId: string): Promise<void> {
    await axiosInstance.delete(`/sessions/${sessionId}`);
  },

  async revokeAllSessions(): Promise<void> {
    await axiosInstance.delete('/sessions');
  }
};

export default authService; 