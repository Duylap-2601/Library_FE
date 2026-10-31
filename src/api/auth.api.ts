import { apiClient } from './client';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
} from '../types/auth.types';

export const authApi = {
  login: (input: LoginInput): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/login', input).then((res) => res.data),

  register: (input: RegisterInput): Promise<AuthResponse> =>
    apiClient
      .post<AuthResponse>('/auth/register', input)
      .then((res) => res.data),

  logout: (): Promise<void> =>
    apiClient.post('/auth/logout').then(() => undefined),

  me: (): Promise<AuthResponse> =>
    apiClient.get<AuthResponse>('/auth/me').then((res) => res.data),
};
