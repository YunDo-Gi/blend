'use client';

import { useState, useEffect, useCallback } from 'react';
import { commentApi } from '@/shared/api';
import { Comment } from '@/shared/types/api';

interface CommentsSectionProps {
  postId: string;
  selectedParagraph?: string | null;
  onParagraphSelect?: (paragraphId: string | null) => void;
}

export default function CommentsSection({
  postId,
  selectedParagraph = null,
  onParagraphSelect = () => {},
}: CommentsSectionProps) {
  const [commentsByBlock, setCommentsByBlock] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [currentSelected, setCurrentSelected] = useState<string | null>(selectedParagraph);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const comments = await commentApi.getAll({ post_id: postId });
      const grouped = comments.reduce<Record<string, Comment[]>>((acc, comment) => {
        const blockId = comment.block_id || 'general';
        if (!acc[blockId]) acc[blockId] = [];
        acc[blockId].push(comment);
        return acc;
      }, {});
      setCommentsByBlock(grouped);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  }, [postId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchComments();
    }
  }, [mounted, fetchComments]);

  useEffect(() => {
    const handleParagraphSelect = (event: CustomEvent) => {
      setCurrentSelected(event.detail);
      onParagraphSelect(event.detail);
    };

    window.addEventListener('selectParagraph', handleParagraphSelect as EventListener);
    return () => {
      window.removeEventListener('selectParagraph', handleParagraphSelect as EventListener);
    };
  }, [onParagraphSelect]);

  const addComment = async () => {
    if (!newComment.trim() || !authorName.trim()) return;

    setLoading(true);
    try {
      await commentApi.create({
        content: newComment.trim(),
        post_id: postId,
        block_id: currentSelected || undefined,
        guest_nickname: authorName.trim(),
        guest_password: guestPassword || undefined,
      });

      await fetchComments();
      setNewComment('');
      setAuthorName('');
      setGuestPassword('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    const password = prompt('비밀번호를 입력하세요:');
    if (!password) return;

    try {
      await commentApi.delete(commentId, { guest_password: password });
      await fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('삭제에 실패했습니다. 비밀번호를 확인해주세요.');
    }
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
    return Object.values(commentsByBlock).reduce((total, comments) => total + comments.length, 0);
  };

  const scrollToBlock = (blockId: string) => {
    const element = document.getElementById(blockId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setCurrentSelected(blockId);
      onParagraphSelect(blockId);
    }
  };

  const getDisplayName = (comment: Comment) => {
    return comment.guest_nickname || comment.author_id || '익명';
  };

  if (!mounted) return null;

  return (
    <div className="comments-section mt-12 pt-8" style={{ borderTop: '1px solid var(--color-line)' }}>
      <h2 className="mb-6 text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
        댓글 ({getTotalCommentCount()})
      </h2>

      {/* 블록 선택 */}
      {Object.keys(commentsByBlock).length > 0 && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-gray-foreground)' }}>
            댓글이 있는 블록:
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(commentsByBlock).map((blockId) => (
              <button
                key={blockId}
                onClick={() => scrollToBlock(blockId)}
                className="rounded-full px-3 py-1 text-sm transition-colors"
                style={{
                  backgroundColor: currentSelected === blockId ? 'var(--color-primary)' : 'var(--color-gray-2)',
                  color: currentSelected === blockId ? 'var(--color-background)' : 'var(--color-foreground)',
                }}
              >
                블록 ({commentsByBlock[blockId]?.length || 0})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 댓글 작성 폼 */}
      <div className="mb-8 rounded-lg p-4" style={{ backgroundColor: 'var(--color-gray-2)' }}>
        <h3 className="mb-4 font-medium" style={{ color: 'var(--color-foreground)' }}>
          {currentSelected ? '선택한 블록에 댓글 작성' : '댓글 작성'}
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="닉네임"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-background)' }}
            />
            <input
              type="password"
              placeholder="비밀번호 (삭제 시 필요)"
              value={guestPassword}
              onChange={(e) => setGuestPassword(e.target.value)}
              className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-background)' }}
            />
          </div>
          <textarea
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none"
            style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-background)' }}
          />
          <div className="flex gap-2">
            <button
              onClick={addComment}
              disabled={!newComment.trim() || !authorName.trim() || loading}
              className="rounded px-4 py-2 text-sm text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}
            >
              {loading ? '작성 중...' : '댓글 작성'}
            </button>
            {currentSelected && (
              <button
                onClick={() => {
                  setCurrentSelected(null);
                  onParagraphSelect(null);
                }}
                className="rounded px-4 py-2 text-sm transition-colors"
                style={{ backgroundColor: 'var(--color-gray)', color: 'var(--color-foreground)' }}
              >
                선택 해제
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 모든 댓글 표시 */}
      <div className="space-y-6">
        {Object.entries(commentsByBlock)
          .filter(([, comments]) => comments.length > 0)
          .map(([blockId, comments]) => (
            <div
              key={blockId}
              className="rounded-lg border p-4"
              style={{ borderColor: 'var(--color-line)' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {blockId === 'general' ? '전체 댓글' : '블록 댓글'}
                </h3>
                {blockId !== 'general' && (
                  <button
                    onClick={() => scrollToBlock(blockId)}
                    className="text-sm hover:opacity-80"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    블록 보기
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded p-3"
                    style={{ backgroundColor: 'var(--color-gray-2)' }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                        {getDisplayName(comment)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--color-gray)' }}>
                          {formatTimestamp(comment.created_at)}
                        </span>
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {getTotalCommentCount() === 0 && (
        <p className="text-center" style={{ color: 'var(--color-gray)' }}>
          아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
        </p>
      )}
    </div>
  );
}
