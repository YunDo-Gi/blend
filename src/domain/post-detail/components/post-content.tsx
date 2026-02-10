'use client';

import type { JSONContent } from '@tiptap/react';
import PostViewer from '@/shared/ui/post-viewer';

interface PostContentProps {
  content: JSONContent;
  postId: string;
}

export default function PostContent({ content, postId }: PostContentProps) {
  return <PostViewer content={content} postId={postId} />;
}
