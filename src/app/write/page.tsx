'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostWriteEditor from '@/domain/post-write/components/post-write-editor';
import { DraftSelectModal } from '@/domain/post-write/components/draft-select-modal';
import { AuthGuard } from '@/domain/auth/components/auth-guard';
import { useAuth } from '@/domain/auth/providers/auth-provider';
import { clearLocalNewDraft, getLocalNewDraft, hasLocalNewDraft } from '@/domain/post-write/hooks/use-post-draft';
import { useMyDrafts, usePost } from '@/shared/hooks/use-posts';
import { Post } from '@/shared/types/api';

type WriteMode = { type: 'new' } | { type: 'draft'; postId: string; post: Post };

function WritePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const draftIdFromUrl = searchParams.get('draft');
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [selectedMode, setSelectedMode] = useState<WriteMode | null>(null);

  const { data: serverDraftsData, isLoading: isLoadingServerDrafts } = useMyDrafts({
    enabled: isAuthenticated,
  });
  const serverDrafts = serverDraftsData?.data ?? [];

  const { data: draftFromUrl, isLoading: isLoadingDraftFromUrl } = usePost(draftIdFromUrl ?? '', {
    enabled: isAuthenticated && !!draftIdFromUrl,
  });

  const localDraft = useMemo(() => {
    if (typeof window === 'undefined' || draftIdFromUrl) return null;
    if (!hasLocalNewDraft()) return null;
    return getLocalNewDraft();
  }, [draftIdFromUrl]);

  const baseMode = useMemo<WriteMode | null>(() => {
    if (isAuthLoading || !isAuthenticated) return null;

    if (draftIdFromUrl) {
      if (draftFromUrl) {
        return { type: 'draft', postId: draftIdFromUrl, post: draftFromUrl };
      }
      if (isLoadingDraftFromUrl) {
        return null;
      }
      return { type: 'new' };
    }

    return { type: 'new' };
  }, [isAuthLoading, isAuthenticated, draftIdFromUrl, draftFromUrl, isLoadingDraftFromUrl]);

  const editorMode = selectedMode ?? baseMode;
  const shouldShowDraftModal =
    !draftIdFromUrl &&
    !isAuthLoading &&
    isAuthenticated &&
    !selectedMode &&
    !isLoadingServerDrafts &&
    (!!localDraft || serverDrafts.length > 0);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && draftIdFromUrl && !isLoadingDraftFromUrl && !draftFromUrl) {
      router.replace('/write');
    }
  }, [isAuthLoading, isAuthenticated, draftIdFromUrl, isLoadingDraftFromUrl, draftFromUrl, router]);

  const handleSelectLocal = useCallback(() => {
    setSelectedMode({ type: 'new' });
  }, []);

  const handleSelectServer = useCallback(
    (post: Post) => {
      setSelectedMode(null);
      router.replace(`/write?draft=${post.id}`);
    },
    [router]
  );

  const handleSelectNew = useCallback(() => {
    clearLocalNewDraft();
    setSelectedMode({ type: 'new' });
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMode({ type: 'new' });
  }, []);

  const shouldWaitForDraftList = !draftIdFromUrl && !selectedMode && isLoadingServerDrafts;
  const isLoading = isAuthLoading || (Boolean(draftIdFromUrl) && isLoadingDraftFromUrl) || shouldWaitForDraftList;

  return (
    <AuthGuard>
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8">
        <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--color-line)' }}>
          <p className="text-gray-foreground mb-2 font-mono text-sm">/ WRITE</p>
          <h1 className="text-foreground text-5xl font-semibold tracking-tight">Create Post</h1>
          <p className="text-gray-foreground mt-3 text-sm">메타 정보를 입력하고 마크다운으로 글을 작성하세요.</p>
        </header>

        {isLoading ? (
          <div className="text-gray py-20 text-center font-mono">Loading...</div>
        ) : editorMode ? (
          <PostWriteEditor
            key={editorMode.type === 'new' ? 'new' : `draft:${editorMode.postId}`}
            initialMode={editorMode}
          />
        ) : null}

        <DraftSelectModal
          isOpen={shouldShowDraftModal}
          onClose={handleCloseModal}
          localDraft={localDraft}
          serverDrafts={serverDrafts}
          isLoadingServerDrafts={isLoadingServerDrafts}
          onSelectLocal={handleSelectLocal}
          onSelectServer={handleSelectServer}
          onSelectNew={handleSelectNew}
        />
      </div>
    </AuthGuard>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="text-gray py-20 text-center font-mono">Loading...</div>}>
      <WritePageContent />
    </Suspense>
  );
}
