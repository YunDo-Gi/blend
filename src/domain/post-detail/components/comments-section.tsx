'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  paragraphId: string;
}

interface CommentsSectionProps {
  postSlug: string;
  selectedParagraph?: string | null;
  onParagraphSelect?: (paragraphId: string | null) => void;
}

export default function CommentsSection({
  postSlug,
  selectedParagraph = null,
  onParagraphSelect = () => {},
}: CommentsSectionProps) {
  const [allComments, setAllComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [currentSelected, setCurrentSelected] = useState<string | null>(selectedParagraph);
  const [mounted, setMounted] = useState(false);

  // 하이드레이션 에러 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const comments: { [key: string]: Comment[] } = {};
    
    // 로컬 스토리지에서 모든 댓글 불러오기
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`comments_${postSlug}_`)) {
        const paragraphId = key.replace(`comments_${postSlug}_`, '');
        const savedComments = localStorage.getItem(key);
        if (savedComments) {
          comments[paragraphId] = JSON.parse(savedComments);
        }
      }
    }
    
    setAllComments(comments);

    // 문단 선택 이벤트 리스너
    const handleParagraphSelect = (event: CustomEvent) => {
      setCurrentSelected(event.detail);
      onParagraphSelect(event.detail);
    };

    window.addEventListener('selectParagraph', handleParagraphSelect as EventListener);
    
    return () => {
      window.removeEventListener('selectParagraph', handleParagraphSelect as EventListener);
    };
  }, [postSlug, mounted]);

  const addComment = () => {
    if (!newComment.trim() || !authorName.trim() || !currentSelected) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName.trim(),
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      paragraphId: currentSelected,
    };

    const commentKey = `comments_${postSlug}_${currentSelected}`;
    const existingComments = allComments[currentSelected] || [];
    const updatedComments = [...existingComments, comment];

    if (mounted) {
      localStorage.setItem(commentKey, JSON.stringify(updatedComments));
    }

    setAllComments(prev => ({
      ...prev,
      [currentSelected]: updatedComments,
    }));

    setNewComment('');
    setAuthorName('');
  };

  const deleteComment = (paragraphId: string, commentId: string) => {
    const commentKey = `comments_${postSlug}_${paragraphId}`;
    const existingComments = allComments[paragraphId] || [];
    const updatedComments = existingComments.filter(c => c.id !== commentId);

    if (mounted) {
      if (updatedComments.length === 0) {
        localStorage.removeItem(commentKey);
      } else {
        localStorage.setItem(commentKey, JSON.stringify(updatedComments));
      }
    }

    setAllComments(prev => ({
      ...prev,
      [paragraphId]: updatedComments,
    }));
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

  const getTotalCommentCount = () => {
    return Object.values(allComments).reduce((total, comments) => total + comments.length, 0);
  };

  const scrollToParagraph = (paragraphId: string) => {
    const element = document.getElementById(paragraphId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setCurrentSelected(paragraphId);
      onParagraphSelect(paragraphId);
    }
  };

  return (
    <div className="comments-section mt-12 pt-8" style={{ borderTop: `1px solid var(--color-line)` }}>
      <h2 className="mb-6 text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
        댓글 ({getTotalCommentCount()})
      </h2>

      {/* 문단 선택 */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          댓글을 작성할 문단 선택:
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(allComments).map((paragraphId) => (
            <button
              key={paragraphId}
              onClick={() => scrollToParagraph(paragraphId)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                currentSelected === paragraphId
                  ? 'text-background'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: currentSelected === paragraphId ? 'var(--color-primary)' : 'var(--color-gray-light)',
                color: currentSelected === paragraphId ? 'var(--color-background)' : 'var(--color-foreground)'
              }}
            >
              문단 {paragraphId.replace('p-', '')} ({allComments[paragraphId]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* 댓글 작성 폼 */}
      {currentSelected && (
        <div className="mb-8 rounded-lg p-4" style={{ backgroundColor: 'var(--color-gray-light)' }}>
          <h3 className="mb-4 font-medium" style={{ color: 'var(--color-foreground)' }}>
            문단 {currentSelected.replace('p-', '')}에 댓글 작성
          </h3>
          <div className="space-y-3">
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
            <div className="flex gap-2">
              <button
                onClick={addComment}
                disabled={!newComment.trim() || !authorName.trim()}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300"
              >
                댓글 작성
              </button>
              <button
                onClick={() => {
                  setCurrentSelected(null);
                  onParagraphSelect(null);
                }}
                className="rounded px-4 py-2 text-sm transition-colors hover:opacity-80"
                style={{ backgroundColor: 'var(--color-gray)', color: 'var(--color-foreground)' }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모든 댓글 표시 */}
      <div className="space-y-6">
        {Object.entries(allComments)
          .filter(([, comments]) => comments.length > 0)
          .map(([paragraphId, comments]) => (
            <div key={paragraphId} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  문단 {paragraphId.replace('p-', '')}
                </h3>
                <button
                  onClick={() => scrollToParagraph(paragraphId)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  문단 보기
                </button>
              </div>
              
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded bg-gray-50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {comment.author}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(comment.timestamp)}
                        </span>
                        <button
                          onClick={() => deleteComment(paragraphId, comment.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {getTotalCommentCount() === 0 && (
        <p className="text-center text-gray-500">
          아직 댓글이 없습니다. 문단을 클릭하여 첫 댓글을 작성해보세요!
        </p>
      )}
    </div>
  );
}