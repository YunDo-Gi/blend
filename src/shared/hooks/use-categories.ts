import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/shared/api';

export const categoryKeys = {
  all: ['categories'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoryApi.getAll(),
  });
}
