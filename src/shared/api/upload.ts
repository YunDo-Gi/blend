import { FileUploadResponse } from '@/shared/types/api';
import { apiClient } from './client';

export const uploadApi = {
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient<FileUploadResponse>('/api/v1/uploads', {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  },
};
