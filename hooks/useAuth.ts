import { useEffect, useState } from 'react';
import { User } from '@/types/auth';
import {
  AuthResponse,
  authService,
  SignInRequest,
  SignUpRequest,
} from '../services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            setAuthState({
              isAuthenticated: true,
              user,
              loading: false,
              error: null,
            });
          } else {
            setAuthState({
              isAuthenticated: false,
              user: null,
              loading: false,
              error: null,
            });
          }
        } catch (error) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    };

    initAuth();
  }, []);

  const signIn = async (credentials: SignInRequest) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authService.signIn(credentials);
      if (response.success === 'true') {
        authService.setToken(response.token);
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null,
        });
        return response;
      }
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: response.error,
      }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      }));
      throw error;
    }
  };

  const signUp = async (userData: SignUpRequest) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authService.signUp(userData);
      if (response.success === 'true') {
        authService.setToken(response.token);
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null,
        });

        return response;
      }
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: response.error,
      }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      await authService.signOut();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }));
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    clearError,
  };
};
