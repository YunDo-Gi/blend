'use client';

import type { JSONContent } from '@tiptap/react';
import { usePost, usePosts } from '@/shared/hooks/use-posts';
import type { Post } from '@/shared/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tteokyi.com';

function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

function extractText(node?: JSONContent): string {
  if (!node) return '';

  if (typeof node.text === 'string') {
    return node.text;
  }

  if (!node.content?.length) {
    return '';
  }

  return node.content.map((child) => extractText(child)).join(' ');
}

function buildFallbackExcerpt(category?: string): string {
  return category ? `${category} category archive.` : 'Latest published note from the archive.';
}

function extractExcerpt(post: Pick<Post, 'category'> & { blocks?: Post['blocks'] }): string {
  const text = (post.blocks ?? [])
    .map((block) => extractText(block.content))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return buildFallbackExcerpt(post.category);
  }

  return text.length > 170 ? `${text.slice(0, 167).trimEnd()}...` : text;
}

export function useRecentPost() {
  const recentPostsQuery = usePosts({ page: 1, limit: 1 });
  const recentPost = recentPostsQuery.data?.data?.[0] ?? null;
  const recentPostDetailQuery = usePost(recentPost?.id ?? '', {
    enabled: !!recentPost?.id,
  });

  const excerpt = recentPostDetailQuery.data
    ? extractExcerpt(recentPostDetailQuery.data)
    : buildFallbackExcerpt(recentPost?.category);

  return {
    recentPost,
    thumbnailUrl: resolveAssetUrl(recentPost?.thumbnail),
    excerpt,
    isLoading: recentPostsQuery.isLoading,
    isEmpty: !recentPostsQuery.isLoading && !recentPost,
  };
}
