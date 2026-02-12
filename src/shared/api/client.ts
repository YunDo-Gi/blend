import { ApiError } from '@/shared/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tteokyi.com';

export class ApiException extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: HeadersInit;
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers } = options;

  const config: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle 401 Unauthorized - auto logout
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('blend.auth.user');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      code: 5000,
      message: 'Unknown error',
    }));
    throw new ApiException(error.code, error.message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  // Handle empty response body (e.g., login endpoint returns 200 with no body)
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text);
}
