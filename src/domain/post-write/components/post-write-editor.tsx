'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { JSONContent } from '@tiptap/react';
import { categoryApi, postApi, uploadApi, ApiException } from '@/shared/api';
import { Category } from '@/shared/types/api';
import { formatSavedTime } from '@/shared/lib/date';
import { usePostDraft } from '@/domain/post-write/hooks/use-post-draft';
import TiptapEditor from './tiptap-editor';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pendingImages, setPendingImages] = useState<Map<string, File>>(new Map());

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
      // returnValue is required for Chrome compatibility
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, isSubmitting]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (form.thumbnail.startsWith('blob:')) {
        URL.revokeObjectURL(form.thumbnail);
      }
      pendingImages.forEach((_, blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeField =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrorMessage(null);
    };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setErrorMessage(null);

    // Create blob URL for preview
    const blobUrl = URL.createObjectURL(file);
    setThumbnailFile(file);
    setForm((prev) => ({ ...prev, thumbnail: blobUrl }));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Upload thumbnail if file exists
      let thumbnailUrl = form.thumbnail.trim();
      if (thumbnailFile && thumbnailUrl.startsWith('blob:')) {
        const response = await uploadApi.uploadFile(thumbnailFile);
        thumbnailUrl = response.url;
        URL.revokeObjectURL(form.thumbnail); // Clean up blob URL
      }

      // 2. Upload pending images from editor
      let finalContent = form.content;
      if (pendingImages.size > 0) {
        finalContent = await uploadPendingImages(form.content);
      }

      // 3. Create post
      const created = await postApi.create({
        title: form.title.trim(),
        content: finalContent,
        category_id: form.categoryId || undefined,
        thumbnail: thumbnailUrl || undefined,
      });

      // Clean up
      setThumbnailFile(null);
      setPendingImages(new Map());
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

  // Helper function to upload pending images and replace blob URLs
  const uploadPendingImages = async (content: JSONContent): Promise<JSONContent> => {
    const urlMap = new Map<string, string>();

    // Upload all pending images
    for (const [blobUrl, file] of pendingImages.entries()) {
      try {
        const response = await uploadApi.uploadFile(file);
        urlMap.set(blobUrl, response.url);
        URL.revokeObjectURL(blobUrl); // Clean up blob URL
      } catch (error) {
        console.error('Failed to upload image:', error);
        throw new Error('이미지 업로드에 실패했습니다.');
      }
    }

    // Replace blob URLs in content
    const replaceUrls = (node: JSONContent): JSONContent => {
      if (node.type === 'image' && node.attrs?.src) {
        const newSrc = urlMap.get(node.attrs.src);
        if (newSrc) {
          return {
            ...node,
            attrs: {
              ...node.attrs,
              src: newSrc,
            },
          };
        }
      }

      if (node.content) {
        return {
          ...node,
          content: node.content.map(replaceUrls),
        };
      }

      return node;
    };

    return replaceUrls(content);
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

          <div className="block space-y-2">
            <span className="text-gray-foreground text-xs">THUMBNAIL</span>
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <input
                  value={form.thumbnail}
                  onChange={onChangeField('thumbnail')}
                  placeholder="https://..."
                  className="border-line bg-background text-foreground w-full border px-3 py-2 text-sm outline-none"
                />
                {form.thumbnail && (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.thumbnail}
                      alt="Thumbnail preview"
                      className="border-line h-32 w-full border object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.alt = 'Failed to load image';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (form.thumbnail.startsWith('blob:')) {
                          URL.revokeObjectURL(form.thumbnail);
                        }
                        setThumbnailFile(null);
                        setForm((prev) => ({ ...prev, thumbnail: '' }));
                      }}
                      className="bg-background border-line text-foreground hover:bg-gray-2 absolute top-2 right-2 border px-2 py-1 font-mono text-xs transition-colors"
                    >
                      REMOVE
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-line bg-background text-foreground hover:bg-gray-2 border px-3 py-2 font-mono text-sm transition-colors"
                >
                  SELECT
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            {errorMessage && <p className="border border-red-400 px-3 py-2 text-xs text-red-500">{errorMessage}</p>}
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
          onImageAdded={(blobUrl, file) => {
            setPendingImages((prev) => new Map(prev).set(blobUrl, file));
          }}
          placeholder="'/'를 입력하여 명령어 사용..."
        />
      </div>
    </section>
  );
}
