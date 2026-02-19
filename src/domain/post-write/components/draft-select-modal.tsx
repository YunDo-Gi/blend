'use client';

import { useEffect } from 'react';
import { Post } from '@/shared/types/api';
import { StoredDraft } from '../hooks/use-post-draft';
import { formatRelativeTime } from '@/shared/lib/date';

interface DraftSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  localDraft: StoredDraft | null;
  serverDrafts: Post[];
  isLoadingServerDrafts: boolean;
  onSelectLocal: () => void;
  onSelectServer: (post: Post) => void;
  onSelectNew: () => void;
}

export function DraftSelectModal({
  isOpen,
  onClose,
  localDraft,
  serverDrafts,
  isLoadingServerDrafts,
  onSelectLocal,
  onSelectServer,
  onSelectNew,
}: DraftSelectModalProps) {
  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasAnyDraft = localDraft || serverDrafts.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
        <div className="border-line bg-background border p-6">
          <h2 className="text-foreground mb-6 font-mono text-lg">
            {hasAnyDraft ? '이어서 작성하기' : '새 글 작성'}
          </h2>

          <div className="space-y-3">
            {/* 로컬 임시저장 */}
            {localDraft && (
              <button
                onClick={onSelectLocal}
                className="border-line hover:border-primary group w-full border p-4 text-left transition-colors"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-gray font-mono text-xs">LOCAL</span>
                </div>
                <div className="text-foreground group-hover:text-primary truncate font-mono transition-colors">
                  {localDraft.form.title || '제목 없음'}
                </div>
                <div className="text-gray mt-1 font-mono text-xs">
                  {formatRelativeTime(new Date(localDraft.savedAt).toISOString())}
                </div>
              </button>
            )}

            {/* 서버 임시저장 목록 */}
            {isLoadingServerDrafts ? (
              <div className="text-gray py-4 text-center font-mono text-sm">
                불러오는 중...
              </div>
            ) : (
              serverDrafts.map((draft) => (
                <button
                  key={draft.id}
                  onClick={() => onSelectServer(draft)}
                  className="border-line hover:border-primary group w-full border p-4 text-left transition-colors"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-gray font-mono text-xs">SERVER</span>
                  </div>
                  <div className="text-foreground group-hover:text-primary truncate font-mono transition-colors">
                    {draft.title || '제목 없음'}
                  </div>
                  <div className="text-gray mt-1 font-mono text-xs">
                    {formatRelativeTime(draft.created_at)}
                  </div>
                </button>
              ))
            )}

            {/* 구분선 */}
            {hasAnyDraft && <div className="border-line border-t" />}

            {/* 새 글 작성 */}
            <button
              onClick={onSelectNew}
              className="border-line hover:border-primary hover:text-primary text-foreground w-full border p-4 text-left font-mono transition-colors"
            >
              + 새 글 작성
            </button>
          </div>

          {/* 닫기 버튼 */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="border-line text-foreground hover:bg-gray-2 w-full border px-4 py-2 font-mono text-sm transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
