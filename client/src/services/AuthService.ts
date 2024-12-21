import $api from "../api";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
  static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/login', {email, password});
  }

  static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/registration', {email, password});
  }

  static async logout(): Promise<AxiosResponse<void>> {
    const refreshToken = localStorage.getItem('token');
    if(!refreshToken) {
      throw new Error('No refresh token found');
    }
    return $api.post('/logout', {refreshToken});
  }

  static async checkAuth(): Promise<AxiosResponse<AuthResponse> | undefined> {
    try {
      const response = await $api.get('/auth/check-auth');
      return response;
    } catch (error: any) {
      console.error('Authentication failed', error);
      return undefined;
    }
  }
}

