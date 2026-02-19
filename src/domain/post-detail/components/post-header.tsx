'use client';

import Image from 'next/image';
import { Post } from '@/shared/types/api';
import { formatDate } from '@/shared/lib/date';

interface PostHeaderProps {
  post: Post;
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="flex flex-col pb-10">
      {/* Category & Date */}
      <div className="text-gray-foreground mb-4 flex items-center gap-2 font-mono text-sm font-medium">
        {post.category && (
          <>
            <span className="text-foreground">{post.category}</span>
            <span>·</span>
          </>
        )}
        <time className="font-mono">{formatDate(post.created_at)}</time>
      </div>

      {/* Title */}
      <h1 className="text-foreground mb-6 text-4xl leading-tight font-bold md:text-5xl">{post.title}</h1>

      {/* Author */}
      <div className="text-gray-foreground flex items-center gap-2 font-mono text-sm">
        <span>BY {post.author}</span>
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="mt-10 w-full">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              unoptimized
              className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
            />
          </div>
        </div>
      )}
    </header>
  );
}
