'use client';

import { PostMetadata } from '@/shared/lib/mdx';

interface PostHeaderProps {
  metadata: PostMetadata;
}

export default function PostHeader({ metadata }: PostHeaderProps) {
  const formatDate = (dateString: string) => {
    return dateString.replace(/-/g, '.');
  };

  return (
    <header className="mb-8 flex flex-col pb-8">
      <time className="text-gray-foreground pb-3 font-mono text-sm font-semibold">{formatDate(metadata.date)}</time>

      <h1 className="text-foreground mb-4 text-5xl font-bold">{metadata.title}</h1>
      <div className="border-foreground aspect-video w-full border"></div>
    </header>
  );
}
