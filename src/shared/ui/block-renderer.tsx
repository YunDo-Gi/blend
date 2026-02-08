'use client';

import { useEffect, useState } from 'react';
import { PostBlock } from '@/shared/types/api';
import CommentIndicator from '@/domain/post-detail/components/comment-indicator';

interface BlockRendererProps {
  block: PostBlock;
  postId: string;
}

export default function BlockRenderer({ block, postId }: BlockRendererProps) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    async function parse() {
      const { parseMarkdown } = await import('@/shared/lib/markdown');
      const result = await parseMarkdown(block.content);
      setHtml(result);
    }
    parse();
  }, [block.content]);

  if (!html) return null;

  return (
    <div
      id={block.id}
      className="group relative paragraph-hover"
    >
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CommentIndicator postSlug={postId} paragraphId={block.id} />
    </div>
  );
}
