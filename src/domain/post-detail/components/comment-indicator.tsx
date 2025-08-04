'use client';

import { useState, useEffect } from 'react';

interface CommentIndicatorProps {
  postSlug: string;
  paragraphId: string;
  onCommentClick: (paragraphId: string) => void;
}

export default function CommentIndicator({
  postSlug,
  paragraphId,
  onCommentClick,
}: CommentIndicatorProps) {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const commentKey = `comments_${postSlug}_${paragraphId}`;
      const savedComments = localStorage.getItem(commentKey);
      if (savedComments) {
        const comments = JSON.parse(savedComments);
        setCommentCount(comments.length);
      }
    }
  }, [postSlug, paragraphId]);

  if (!paragraphId) return null;

  return (
    <button
      onClick={() => onCommentClick(paragraphId)}
      className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600 hover:bg-blue-200"
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
      {commentCount > 0 ? commentCount : '댓글'}
    </button>
  );
}