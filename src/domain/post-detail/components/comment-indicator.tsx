'use client';

import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import { commentApi } from '@/shared/api';

interface CommentIndicatorProps {
  postSlug: string;
  paragraphId: string;
}

export default function CommentIndicator({ postSlug, paragraphId }: CommentIndicatorProps) {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    async function fetchCommentCount() {
      try {
        const comments = await commentApi.getAll({ block_id: paragraphId });
        setCommentCount(comments.length);
      } catch {
        setCommentCount(0);
      }
    }

    if (paragraphId) {
      fetchCommentCount();
    }
  }, [postSlug, paragraphId]);

  const handleClick = () => {
    const event = new CustomEvent('selectParagraph', { detail: paragraphId });
    window.dispatchEvent(event);

    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!paragraphId) return null;

  return (
    <button
      onClick={handleClick}
      className="comment-indicator inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-opacity"
      style={{
        backgroundColor: 'var(--color-gray-2)',
        color: 'var(--color-foreground)',
      }}
    >
      <ChatBubbleIcon className="h-3 w-3" />
      {commentCount > 0 ? commentCount : '+'}
    </button>
  );
}
