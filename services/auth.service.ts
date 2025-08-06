import { SignInRequest, SignUpRequest, AuthResponse, User } from '../types/auth';
export  class  AuthService {
    private   baseUrl = "/api/auth";

   async signIn(credentials: SignInRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Sign in failed');
    }

    return response.json();
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    const userSignupData = {
      firstname: userData.name.split(' ')[0] || '',
      lastname: userData.name.split(' ')[1] || '' ,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || '',
    };
    console.log('User signup data:', userSignupData);
    const response = await fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSignupData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Sign up failed');
    }

    return response.json();
  }

  async signOut(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${this.baseUrl}/signout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        // Continue with local signout even if API call fails
      }
    }
    
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.signOut();
        return null;
      }

      return response.json();
    } catch (error) {
      this.signOut();
      return null;
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
          return value;
        }
      }
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=strict`;
    }
  }
}

export const authService = new AuthService();
export type { SignInRequest, SignUpRequest, AuthResponse };
