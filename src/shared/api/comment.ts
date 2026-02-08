import { apiClient } from './client';
import {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  DeleteCommentRequest,
} from '@/shared/types/api';

const BASE_PATH = '/api/v1/comment';

export type CommentListParams = {
  post_id?: string;
  block_id?: string;
  parent_id?: string;
};

export const commentApi = {
  getAll: (params: CommentListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.post_id) searchParams.set('post_id', params.post_id);
    if (params.block_id) searchParams.set('block_id', params.block_id);
    if (params.parent_id) searchParams.set('parent_id', params.parent_id);

    const query = searchParams.toString();
    return apiClient<Comment[]>(`${BASE_PATH}${query ? `?${query}` : ''}`);
  },

  create: (data: CreateCommentRequest) =>
    apiClient<Comment>(BASE_PATH, {
      method: 'POST',
      body: data,
    }),

  update: (id: string, data: UpdateCommentRequest) =>
    apiClient<Comment>(`${BASE_PATH}/${id}`, {
      method: 'PATCH',
      body: data,
    }),

  delete: (id: string, data?: DeleteCommentRequest) =>
    apiClient<void>(`${BASE_PATH}/${id}`, {
      method: 'DELETE',
      body: data,
    }),
};
