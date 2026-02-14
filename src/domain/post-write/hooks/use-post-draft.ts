'use client';

import { useEffect, useMemo, useState } from 'react';
import type { JSONContent } from '@tiptap/react';

const DRAFT_STORAGE_KEY = 'blend.write-draft.v1';

export interface PostDraftForm {
  title: string;
  categoryId: string;
  thumbnail: string;
  content: JSONContent;
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

function safeParseDraft(value: string): Partial<PostDraftForm> | null {
  try {
    const parsed = JSON.parse(value) as Partial<PostDraftForm>;
    if (typeof parsed !== 'object' || !parsed) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function usePostDraft() {
  const [form, setForm] = useState<PostDraftForm>(INITIAL_POST_DRAFT);
  const [isReady, setIsReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!storedDraft) return;

      const parsed = safeParseDraft(storedDraft);
      if (!parsed) return;

      setForm((prev) => ({
        ...prev,
        title: typeof parsed.title === 'string' ? parsed.title : prev.title,
        categoryId: typeof parsed.categoryId === 'string' ? parsed.categoryId : prev.categoryId,
        thumbnail: typeof parsed.thumbnail === 'string' ? parsed.thumbnail : prev.thumbnail,
        content:
          parsed.content && typeof parsed.content === 'object' && !Array.isArray(parsed.content)
            ? (parsed.content as JSONContent)
            : prev.content,
      }));
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const timeoutId = window.setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
      setLastSavedAt(Date.now());
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [form, isReady]);

  const isDirty = useMemo(() => {
    return (
      form.title !== INITIAL_POST_DRAFT.title ||
      form.categoryId !== INITIAL_POST_DRAFT.categoryId ||
      form.thumbnail !== INITIAL_POST_DRAFT.thumbnail ||
      JSON.stringify(form.content) !== JSON.stringify(INITIAL_POST_DRAFT.content)
    );
  }, [form]);

  const saveDraft = () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
    setLastSavedAt(Date.now());
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setForm(INITIAL_POST_DRAFT);
    setLastSavedAt(null);
  };

  return {
    form,
    setForm,
    isDirty,
    isReady,
    lastSavedAt,
    saveDraft,
    clearDraft,
  };
}
