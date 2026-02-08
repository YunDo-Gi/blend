'use client';

import { useState, useEffect } from 'react';
import { commentApi } from '@/shared/api';

interface CommentIndicatorProps {
  postSlug: string;
  paragraphId: string;
}

export default function CommentIndicator({
  postSlug,
  paragraphId,
}: CommentIndicatorProps) {
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
      className="comment-indicator absolute right-0 top-0 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-opacity"
      style={{
        backgroundColor: 'var(--color-gray-2)',
        color: 'var(--color-foreground)',
      }}
    >
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      {commentCount > 0 ? commentCount : '+'}
    </button>
  );
}
