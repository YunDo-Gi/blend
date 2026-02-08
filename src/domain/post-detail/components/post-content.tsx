'use client';

import { PostBlock } from '@/shared/types/api';
import BlockRenderer from '@/shared/ui/block-renderer';

interface PostContentProps {
  blocks: PostBlock[];
  postId: string;
}

export default function PostContent({ blocks, postId }: PostContentProps) {
  return (
    <article className="space-y-2">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} postId={postId} />
      ))}
    </article>
  );
}
