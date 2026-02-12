import { apiClient } from './client';
import { LoginRequest, UserResponse } from '@/shared/types/api';

const BASE_PATH = '/api/v1';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient<void>(`${BASE_PATH}/auth/login`, {
      method: 'POST',
      body: data,
    }),

  logout: () =>
    apiClient<void>(`${BASE_PATH}/auth/logout`, {
      method: 'POST',
    }),

  getMe: () => apiClient<UserResponse>(`${BASE_PATH}/user/me`),
};
