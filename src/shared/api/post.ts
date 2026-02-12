import { apiClient } from './client';
import {
  Post,
  PostListResponse,
  CreatePostRequest,
  UpdatePostRequest,
  UpdatePostContentRequest,
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

  /** 포스트 메타데이터 수정 (PATCH /post/{id}) */
  update: (id: string, data: UpdatePostRequest) =>
    apiClient<Post>(`${BASE_PATH}/${id}`, {
      method: 'PATCH',
      body: data,
    }),

  /** 포스트 본문 수정 (PUT /post/{id}/content) */
  updateContent: (id: string, data: UpdatePostContentRequest) =>
    apiClient<Post>(`${BASE_PATH}/${id}/content`, {
      method: 'PUT',
      body: data,
    }),

  /** 포스트 삭제 (DELETE /post/{id}) */
  delete: (id: string) =>
    apiClient<void>(`${BASE_PATH}/${id}`, {
      method: 'DELETE',
    }),
};
