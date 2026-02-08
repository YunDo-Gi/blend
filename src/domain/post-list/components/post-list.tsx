'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { postApi } from '@/shared/api';
import { Post, Pagination as PaginationType } from '@/shared/types/api';
import PostItem from './post-item';
import Pagination from '@/shared/ui/pagination';

interface PostListProps {
  onTotalCountChange?: (count: number) => void;
}

export default function PostList({ onTotalCountChange }: PostListProps) {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const response = await postApi.getAll({
          page: currentPage,
          limit: 10,
          category: selectedCategory || undefined,
        });
        setPosts(response.data);
        setPagination(response.pagination);
        onTotalCountChange?.(response.pagination.total);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [currentPage, selectedCategory, onTotalCountChange]);

  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.ceil(pagination.total / pagination.limit);
  }, [pagination]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (loading) return null;

  return (
    <div className="bg-background">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          date={formatDate(post.created_at)}
          title={post.title}
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
