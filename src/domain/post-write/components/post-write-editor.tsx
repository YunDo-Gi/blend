'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JSONContent } from '@tiptap/react';
import { categoryApi, postApi, ApiException } from '@/shared/api';
import { Category } from '@/shared/types/api';
import { usePostDraft } from '@/domain/post-write/hooks/use-post-draft';
import TiptapEditor from './tiptap-editor';

function formatSavedTime(timestamp: number | null): string {
  if (!timestamp) return '저장 대기 중';
  return `임시저장 ${new Date(timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`;
}

function hasContent(node?: JSONContent): boolean {
  if (!node) return false;
  if (node.type === 'text') return Boolean(node.text?.trim());
  if (!node.content?.length) return false;
  return node.content.some(hasContent);
}

export default function PostWriteEditor() {
  const router = useRouter();
  const { form, setForm, isDirty, isReady, lastSavedAt, clearDraft } = usePostDraft();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return form.title.trim().length > 0 && hasContent(form.content) && !isSubmitting;
  }, [form.title, form.content, isSubmitting]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await categoryApi.getAll();
        if (!active) return;
        setCategories(response);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        if (active) setLoadingCategories(false);
      }
    }

    loadCategories();
    return () => {
      active = false;
    };
  }, []);


  useEffect(() => {
    if (!isDirty || isSubmitting) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, isSubmitting]);

  const onChangeField =
    (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrorMessage(null);
    };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const created = await postApi.create({
        title: form.title.trim(),
        content: form.content,
        category_id: form.categoryId || undefined,
        thumbnail: form.thumbnail.trim() || undefined,
      });

      clearDraft();
      router.push(`/posts/${created.id}`);
    } catch (error) {
      if (error instanceof ApiException) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('게시글 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="border-line bg-background border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground font-mono text-sm">/ META</h2>
          <div className="text-gray-foreground font-mono text-xs">
            {isReady ? formatSavedTime(lastSavedAt) : '임시저장 초기화 중'}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <label className="block space-y-2">
            <span className="text-gray-foreground text-xs">TITLE</span>
            <input
              value={form.title}
              onChange={onChangeField('title')}
              placeholder="제목을 입력하세요"
              className="border-line bg-background text-foreground w-full border px-3 py-2 text-sm outline-none"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-gray-foreground text-xs">CATEGORY</span>
            <select
              value={form.categoryId}
              onChange={onChangeField('categoryId')}
              className="border-line bg-background text-foreground w-full border px-3 py-2 text-sm outline-none"
              disabled={loadingCategories}
            >
              <option value="">{loadingCategories ? '불러오는 중...' : '선택 안 함'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-gray-foreground text-xs">THUMBNAIL URL</span>
            <input
              value={form.thumbnail}
              onChange={onChangeField('thumbnail')}
              placeholder="https://..."
              className="border-line bg-background text-foreground w-full border px-3 py-2 text-sm outline-none"
            />
          </label>

          <div className="flex flex-col justify-end space-y-2">
            {errorMessage && (
              <p className="border border-red-400 px-3 py-2 text-xs text-red-500">{errorMessage}</p>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="border-foreground text-foreground hover:bg-primary/75 w-full border border-dotted px-4 py-2 font-mono text-sm disabled:opacity-40"
            >
              {isSubmitting ? 'PUBLISHING...' : 'PUBLISH'}
            </button>
          </div>
        </div>
      </header>

      <div className="border-line bg-background flex min-h-[600px] flex-col border">
        <TiptapEditor
          content={form.content}
          onChange={(content) => setForm((prev) => ({ ...prev, content }))}
          placeholder="'/'를 입력하여 명령어 사용..."
        />
      </div>
    </section>
  );
}
