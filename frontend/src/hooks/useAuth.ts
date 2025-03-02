import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import authService from '@services/auth.service';

import { AuthState, SignUpData, LoginData } from '@/types/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: authService.getCurrentUser(),
    token: authService.getToken(),
    isAuthenticated: authService.isAuthenticated(),
  });

  const signup = useCallback(async (data: SignUpData) => {
    try {
      const response = await authService.signup(data);
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
      navigate('/welcome');
      return response;
    } catch (error) {
      throw error;
    }
  }, [navigate]);

  const login = useCallback(async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
      navigate('/welcome');
      return response;
    } catch (error) {
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authService.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    if (token && user) {
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });
    }
  }, []);

  return {
    ...authState,
    signup,
    login,
    logout,
  };
}; 