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

export default function PostList({ onTotalCountChange }: PostListProps) {
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const selectedCategory = searchParams.get('category') || '';

  const { data, isLoading } = usePosts({
    page: currentPage,
    limit: 10,
    category: selectedCategory || undefined,
  });

  const posts = data?.data ?? [];
  const pagination = data?.pagination ?? null;

  useEffect(() => {
    if (pagination) {
      onTotalCountChange?.(pagination.total);
    }
  }, [pagination, onTotalCountChange]);

  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.ceil(pagination.total / pagination.limit);
  }, [pagination]);

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
          게시글이 없습니다.
        </div>
      )}

      {posts.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
    </div>
  );
}

