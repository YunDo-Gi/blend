'use client';

import PostViewer from '@/shared/ui/post-viewer';
import type { PostBlock } from '@/shared/types/api';

interface PostContentProps {
  blocks: PostBlock[];
  postId: string;
}

export default function PostContent({ blocks, postId }: PostContentProps) {
  return <PostViewer blocks={blocks} postId={postId} />;
}
