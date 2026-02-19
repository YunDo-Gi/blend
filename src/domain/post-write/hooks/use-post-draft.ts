'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { JSONContent } from '@tiptap/react';

const DRAFT_KEY_PREFIX = 'blend.draft';
const DRAFT_NEW_KEY = `${DRAFT_KEY_PREFIX}.new`;

export interface PostDraftForm {
  title: string;
  categoryId: string;
  thumbnail: string;
  content: JSONContent;
}

export interface StoredDraft {
  form: PostDraftForm;
  savedAt: number;
}

const EMPTY_CONTENT: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export const INITIAL_POST_DRAFT: PostDraftForm = {
  title: '',
  categoryId: '',
  thumbnail: '',
  content: EMPTY_CONTENT,
};

function getDraftKey(postId?: string): string {
  return postId ? `${DRAFT_KEY_PREFIX}.${postId}` : DRAFT_NEW_KEY;
}

function safeParseDraft(value: string): StoredDraft | null {
  try {
    const parsed = JSON.parse(value) as StoredDraft;
    if (typeof parsed !== 'object' || !parsed || !parsed.form) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasLocalNewDraft(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(DRAFT_NEW_KEY);
  if (!stored) return false;
  const parsed = safeParseDraft(stored);
  if (!parsed) return false;
  return (
    parsed.form.title.trim() !== '' ||
    JSON.stringify(parsed.form.content) !== JSON.stringify(EMPTY_CONTENT)
  );
}

export function getLocalNewDraft(): StoredDraft | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(DRAFT_NEW_KEY);
  if (!stored) return null;
  return safeParseDraft(stored);
}

export function clearLocalNewDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_NEW_KEY);
}

interface UsePostDraftOptions {
  postId?: string;
  initialForm?: PostDraftForm;
}

export function usePostDraft(options: UsePostDraftOptions = {}) {
  const { postId, initialForm } = options;
  const storageKey = getDraftKey(postId);

  const [form, setForm] = useState<PostDraftForm>(initialForm ?? INITIAL_POST_DRAFT);
  const [isReady, setIsReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Restore local draft if present; fallback to provided initial form.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = safeParseDraft(stored);
        if (parsed) {
          setForm(parsed.form);
          setLastSavedAt(parsed.savedAt);
          setIsReady(true);
          return;
        }
      }

      setForm(initialForm ?? INITIAL_POST_DRAFT);
      setLastSavedAt(null);
    } finally {
      setIsReady(true);
    }
  }, [initialForm, storageKey]);

  useEffect(() => {
    if (!isReady) return;

    const timeoutId = window.setTimeout(() => {
      const draft: StoredDraft = {
        form,
        savedAt: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setLastSavedAt(draft.savedAt);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [form, isReady, storageKey]);

  const isDirty = useMemo(() => {
    const compareForm = initialForm ?? INITIAL_POST_DRAFT;
    return (
      form.title !== compareForm.title ||
      form.categoryId !== compareForm.categoryId ||
      form.thumbnail !== compareForm.thumbnail ||
      JSON.stringify(form.content) !== JSON.stringify(compareForm.content)
    );
  }, [form, initialForm]);

  const saveDraft = useCallback(() => {
    const draft: StoredDraft = {
      form,
      savedAt: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(draft));
    setLastSavedAt(draft.savedAt);
  }, [form, storageKey]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setForm(initialForm ?? INITIAL_POST_DRAFT);
    setLastSavedAt(null);
  }, [storageKey, initialForm]);

  const migrateToServerDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_NEW_KEY);
  }, []);

  return {
    form,
    setForm,
    isDirty,
    isReady,
    lastSavedAt,
    saveDraft,
    clearDraft,
    migrateToServerDraft,
  };
}
