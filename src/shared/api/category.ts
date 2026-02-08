import { apiClient } from './client';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/shared/types/api';

const BASE_PATH = '/api/v1/category';

export const categoryApi = {
  getAll: () => apiClient<Category[]>(BASE_PATH),

  create: (data: CreateCategoryRequest) =>
    apiClient<Category>(BASE_PATH, {
      method: 'POST',
      body: data,
    }),

  update: (id: string, data: UpdateCategoryRequest) =>
    apiClient<Category>(`${BASE_PATH}/${id}`, {
      method: 'PATCH',
      body: data,
    }),

  delete: (id: string) =>
    apiClient<void>(`${BASE_PATH}/${id}`, {
      method: 'DELETE',
    }),
};
