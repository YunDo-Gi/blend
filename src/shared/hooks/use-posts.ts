import { useQuery } from '@tanstack/react-query';
import { postApi, PostListParams } from '@/shared/api/post';
import { MyPostsParams } from '@/shared/types/api';

interface QueryOptions {
  enabled?: boolean;
}

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: PostListParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  myPosts: () => [...postKeys.all, 'my'] as const,
  myList: (params: MyPostsParams) => [...postKeys.myPosts(), params] as const,
};

export function usePosts(params: PostListParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postApi.getAll(params),
  });
}

export function usePost(id: string, options: QueryOptions = {}) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postApi.getById(id),
    enabled: (options.enabled ?? true) && !!id,
  });
}

export function useMyPosts(params: MyPostsParams = {}, options: QueryOptions = {}) {
  return useQuery({
    queryKey: postKeys.myList(params),
    queryFn: () => postApi.getMyPosts(params),
    enabled: options.enabled ?? true,
  });
}

export function useMyDrafts(options: QueryOptions = {}) {
  return useMyPosts({ status: 'DRAFT' }, options);
}
