import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await api.get(`/auth/verify/${token}`);
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  setAuthData(user: User, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  },

  getAuthData(): { user: User | null; token: string | null } {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    return {
      user: userStr ? JSON.parse(userStr) : null,
      token,
    };
  },

  clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  },

  isAuthenticated(): boolean {
    const { user, token } = this.getAuthData();
    return !!(user && token);
  },
};