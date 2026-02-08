import { apiClient } from './client';
import {
  Post,
  PostListResponse,
  CreatePostRequest,
  UpdatePostRequest,
} from '@/shared/types/api';

const BASE_PATH = '/api/v1/post';

export type PostListParams = {
  category?: string;
  page?: number;
  limit?: number;
};

export const postApi = {
  getAll: (params: PostListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return apiClient<PostListResponse>(`${BASE_PATH}${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiClient<Post>(`${BASE_PATH}/${id}`),

  create: (data: CreatePostRequest) =>
    apiClient<Post>(BASE_PATH, {
      method: 'POST',
      body: data,
    }),

  update: (id: string, data: UpdatePostRequest) =>
    apiClient<Post>(`${BASE_PATH}/${id}`, {
      method: 'PUT',
      body: data,
    }),
};
