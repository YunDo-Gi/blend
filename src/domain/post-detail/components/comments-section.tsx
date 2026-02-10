'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/shared/types/api';
import { formatRelativeTime } from '@/shared/lib/date';
import { scrollToElement } from '@/shared/lib/scroll';
import { useComments } from '../hooks/use-comments';

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
  const { commentsByBlock, loading, fetchComments, addComment, deleteComment, getTotalCount } =
    useComments({ postId });

  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [currentSelected, setCurrentSelected] = useState<string | null>(selectedParagraph);
  const [mounted, setMounted] = useState(false);

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

  const handleAddComment = async () => {
    const success = await addComment({
      content: newComment,
      blockId: currentSelected,
      guestNickname: authorName,
      guestPassword,
    });

    if (success) {
      setNewComment('');
      setAuthorName('');
      setGuestPassword('');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const password = prompt('비밀번호를 입력하세요:');
    if (!password) return;

    const success = await deleteComment(commentId, password);
    if (!success) {
      alert('삭제에 실패했습니다. 비밀번호를 확인해주세요.');
    }
  };

  const scrollToBlock = (blockId: string) => {
    if (scrollToElement(blockId)) {
      setCurrentSelected(blockId);
      onParagraphSelect(blockId);
    }
  };

  const getDisplayName = (comment: Comment) => {
    return comment.guest_nickname || comment.author_id || '익명';
  };

  if (!mounted) return null;

  return (
    <section className="comments-section border-line mt-16 border-t pt-12">
      {/* 헤더 */}
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-foreground text-xl font-bold">댓글</h2>
        <span className="text-gray-foreground font-mono text-sm">{getTotalCount()}개</span>
      </div>

      {/* 블록 필터 */}
      {Object.keys(commentsByBlock).length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCurrentSelected(null);
              onParagraphSelect(null);
            }}
            className={`border-line text-foreground border px-3 py-1.5 font-mono text-xs transition-colors ${
              !currentSelected ? 'bg-foreground text-background' : 'hover:bg-gray-2'
            }`}
          >
            전체
          </button>
          {Object.keys(commentsByBlock).map((blockId) => (
            <button
              key={blockId}
              onClick={() => scrollToBlock(blockId)}
              className={`border-line text-foreground border px-3 py-1.5 font-mono text-xs transition-colors ${
                currentSelected === blockId ? 'bg-foreground text-background' : 'hover:bg-gray-2'
              }`}
            >
              #{blockId.slice(-4)} ({commentsByBlock[blockId]?.length || 0})
            </button>
          ))}
        </div>
      )}

      {/* 댓글 작성 폼 */}
      <div className="border-line mb-10 border p-5">
        {currentSelected && (
          <div className="text-gray-foreground mb-4 flex items-center justify-between font-mono text-xs">
            <span>블록 #{currentSelected.slice(-4)}에 댓글 작성</span>
            <button
              onClick={() => {
                setCurrentSelected(null);
                onParagraphSelect(null);
              }}
              className="hover:text-foreground underline"
            >
              선택 해제
            </button>
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="닉네임"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="border-line bg-background text-foreground placeholder:text-gray w-full border px-3 py-2 font-mono text-sm focus:outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={guestPassword}
            onChange={(e) => setGuestPassword(e.target.value)}
            className="border-line bg-background text-foreground placeholder:text-gray w-full border px-3 py-2 font-mono text-sm focus:outline-none"
          />
        </div>

        <textarea
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          className="border-line bg-background text-foreground placeholder:text-gray mb-4 w-full resize-none border px-3 py-2 text-sm focus:outline-none"
        />

        <button
          onClick={handleAddComment}
          disabled={!newComment.trim() || !authorName.trim() || loading}
          className="bg-foreground text-background hover:opacity-90 disabled:opacity-40 px-5 py-2 font-mono text-sm transition-opacity"
        >
          {loading ? '작성 중...' : '작성'}
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-0">
        {Object.entries(commentsByBlock)
          .filter(([, comments]) => comments.length > 0)
          .flatMap(([blockId, comments]) =>
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border-line group border-b py-5 first:border-t"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-foreground text-sm font-medium">
                    {getDisplayName(comment)}
                  </span>
                  <span className="text-gray font-mono text-xs">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                  {blockId !== 'general' && (
                    <button
                      onClick={() => scrollToBlock(blockId)}
                      className="text-gray hover:text-foreground font-mono text-xs"
                    >
                      #{blockId.slice(-4)}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray hover:text-foreground ml-auto font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    삭제
                  </button>
                </div>
                <p className="text-foreground text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          )}
      </div>

      {getTotalCount() === 0 && (
        <p className="text-gray py-12 text-center text-sm">
          아직 댓글이 없습니다.
        </p>
      )}
    </section>
  );
}
