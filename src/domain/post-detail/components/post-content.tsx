'use client';

import PostViewer from '@/shared/ui/post-viewer';
import type { PostBlock } from '@/shared/types/api';

interface PostContentProps {
  blocks: PostBlock[];
  postId: string;
  postTitle?: string;
  postAuthor?: string;
  postThumbnail?: string;
  postCategory?: string;
}

export default function PostContent({
  blocks,
  postId,
  postTitle,
  postAuthor,
  postThumbnail,
  postCategory,
}: PostContentProps) {
  return (
    <PostViewer
      blocks={blocks}
      postId={postId}
      postMeta={{
        title: postTitle,
        author: postAuthor,
        thumbnail: postThumbnail,
        category: postCategory,
      }}
    />
  );
}
