'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface ParagraphCommentsProps {
  postSlug: string;
  paragraphId: string;
}

export default function ParagraphComments({
  postSlug,
  paragraphId,
}: ParagraphCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const commentKey = `comments_${postSlug}_${paragraphId}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedComments = localStorage.getItem(commentKey);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    }
  }, [commentKey]);

  const saveComments = (updatedComments: Comment[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(commentKey, JSON.stringify(updatedComments));
    }
    setComments(updatedComments);
  };

  const addComment = () => {
    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName.trim(),
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    setNewComment('');
    setAuthorName('');
  };

  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    saveComments(updatedComments);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!paragraphId) return null;

  return (
    <div className="mt-2 border-l-2 border-gray-100 pl-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg
          className="h-4 w-4"
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
        댓글 {comments.length}개
        {isOpen ? '숨기기' : '보기'}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg bg-gray-50 p-3 text-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {comment.author}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}

          <div className="space-y-2">
            <input
              type="text"
              placeholder="이름"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim() || !authorName.trim()}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
            >
              댓글 작성
            </button>
          </div>
        </div>
      )}
    </div>
  );
}