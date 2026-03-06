'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePosts } from '@/shared/hooks/use-posts';
import { formatDate } from '@/shared/lib/date';
import PostItem from './post-item';
import Pagination from '@/shared/ui/pagination';

interface PostListProps {
  onTotalCountChange?: (count: number) => void;
}

const POSTS_PER_PAGE = 10;
const SEARCH_FETCH_LIMIT = 1000;

export default function PostList({ onTotalCountChange }: PostListProps) {
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const isSearching = normalizedSearchQuery.length > 0;

  const paginatedPostsQuery = usePosts(
    {
      page: currentPage,
      limit: POSTS_PER_PAGE,
      category: selectedCategory || undefined,
    },
    {
      enabled: !isSearching,
    },
  );
  const searchablePostsQuery = usePosts(
    {
      page: 1,
      limit: SEARCH_FETCH_LIMIT,
      category: selectedCategory || undefined,
    },
    {
      enabled: isSearching,
    },
  );

  const paginatedPosts = useMemo(() => paginatedPostsQuery.data?.data ?? [], [paginatedPostsQuery.data?.data]);
  const pagination = paginatedPostsQuery.data?.pagination ?? null;
  const searchablePosts = useMemo(() => searchablePostsQuery.data?.data ?? [], [searchablePostsQuery.data?.data]);

  const filteredPosts = useMemo(() => {
    if (!isSearching) return paginatedPosts;

    return searchablePosts.filter((post) => post.title.toLocaleLowerCase().includes(normalizedSearchQuery));
  }, [isSearching, normalizedSearchQuery, paginatedPosts, searchablePosts]);

  const totalCount = isSearching ? filteredPosts.length : (pagination?.total ?? 0);

  useEffect(() => {
    onTotalCountChange?.(totalCount);
  }, [onTotalCountChange, totalCount]);

  const totalPages = useMemo(() => {
    if (isSearching) {
      return Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));
    }

    if (!pagination) return 1;
    return Math.ceil(pagination.total / pagination.limit);
  }, [isSearching, pagination, totalCount]);

  const activePage = isSearching ? Math.min(currentPage, totalPages) : currentPage;

  const posts = useMemo(() => {
    if (!isSearching) return paginatedPosts;

    const startIndex = (activePage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [activePage, filteredPosts, isSearching, paginatedPosts]);

  const isLoading = isSearching ? searchablePostsQuery.isLoading : paginatedPostsQuery.isLoading;

  if (isLoading) return null;

  return (
    <div className="bg-background">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          date={formatDate(post.created_at)}
          title={post.title}
          author={post.author}
          thumbnail={post.thumbnail}
        />
      ))}

      {posts.length === 0 && (
        <div className="p-8 text-center" style={{ color: 'var(--color-gray)' }}>
          {isSearching ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
        </div>
      )}

      {posts.length > 0 && <Pagination currentPage={activePage} totalPages={totalPages} />}
    </div>
  );
}
