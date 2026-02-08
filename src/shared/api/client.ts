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
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

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

  return response.json();
}
