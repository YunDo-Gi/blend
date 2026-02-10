'use client';

import { Post } from '@/shared/types/api';
import { formatDate } from '@/shared/lib/date';

interface PostHeaderProps {
  post: Post;
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-8 flex flex-col pb-8">
      <time className="text-gray-foreground pb-3 font-mono text-sm font-semibold">
        {formatDate(post.created_at)}
      </time>

      <h1 className="text-foreground mb-4 text-5xl font-bold">{post.title}</h1>

      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt={post.title}
          className="aspect-video w-full rounded border border-line object-cover"
        />
      ) : (
        <div className="border-foreground aspect-video w-full border"></div>
      )}

      {post.category && (
        <div className="mt-4">
          <span className="text-gray-foreground text-sm">{post.category}</span>
        </div>
      )}
    </header>
  );
}
