'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JSONContent } from '@tiptap/react';
import { toast } from 'sonner';
import { postApi, uploadApi, ApiException } from '@/shared/api';
import { Post, PostStatus } from '@/shared/types/api';
import { useCategories } from '@/shared/hooks/use-categories';
import { formatSavedTime } from '@/shared/lib/date';
import { apiToTiptap, tiptapToApi } from '@/shared/lib/block-transform';
import { usePostDraft, PostDraftForm } from '@/domain/post-write/hooks/use-post-draft';
import TiptapEditor from './tiptap-editor';

type WriteMode = { type: 'new' } | { type: 'draft'; postId: string; post: Post };
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tteokyi.com';

function hasContent(node?: JSONContent): boolean {
  if (!node) return false;
  if (node.type === 'text') return Boolean(node.text?.trim());
  if (!node.content?.length) return false;
  return node.content.some(hasContent);
}

function sanitizeNodeForCreate(node: JSONContent): JSONContent {
  const { attrs, content, ...rest } = node;
  const sanitizedAttrs =
    attrs && typeof attrs === 'object'
      ? Object.fromEntries(
          Object.entries(attrs).filter(([, value]) => value !== null && value !== undefined)
        )
      : undefined;

  return {
    ...rest,
    ...(sanitizedAttrs && Object.keys(sanitizedAttrs).length > 0 ? { attrs: sanitizedAttrs } : {}),
    ...(content ? { content: content.map(sanitizeNodeForCreate) } : {}),
  };
}

function buildCreateContentPayload(content: JSONContent): JSONContent[] {
  if (!content.content || content.content.length === 0) return [];
  return content.content.map(sanitizeNodeForCreate);
}

function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

function normalizeContentImageUrls(node: JSONContent): JSONContent {
  if (node.type === 'image' && typeof node.attrs?.src === 'string') {
    return {
      ...node,
      attrs: {
        ...node.attrs,
        src: resolveAssetUrl(node.attrs.src),
      },
    };
  }

  if (node.content) {
    return {
      ...node,
      content: node.content.map(normalizeContentImageUrls),
    };
  }

  return node;
}

function postToForm(post: Post): PostDraftForm {
  const tiptapContent = apiToTiptap(post.blocks);
  return {
    title: post.title,
    categoryId: post.category_id ?? '',
    thumbnail: resolveAssetUrl(post.thumbnail || ''),
    content: normalizeContentImageUrls(tiptapContent),
  };
}

interface PostWriteEditorProps {
  initialMode: WriteMode;
}

export default function PostWriteEditor({ initialMode }: PostWriteEditorProps) {
  const router = useRouter();
  const [mode, setMode] = useState<WriteMode>(initialMode);

  const initialForm = useMemo(() => {
    if (mode.type !== 'new' && mode.post) {
      return postToForm(mode.post);
    }
    return undefined;
  }, [mode]);

  const postId = mode.type === 'new' ? undefined : mode.postId;
  const { form, setForm, isDirty, isReady, lastSavedAt, clearDraft, migrateToServerDraft } = usePostDraft({
    postId,
    initialForm,
  });
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pendingImages, setPendingImages] = useState<Map<string, File>>(new Map());
  const blobUrlsRef = useRef<Set<string>>(new Set());

  const isSubmitting = isSavingDraft || isPublishing;
  const canSubmit = useMemo(() => {
    return form.title.trim().length > 0 && hasContent(form.content) && !isSubmitting;
  }, [form.title, form.content, isSubmitting]);

  const canSaveDraft = useMemo(() => {
    return (form.title.trim().length > 0 || hasContent(form.content)) && !isSubmitting;
  }, [form.title, form.content, isSubmitting]);

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

  useEffect(() => {
    const blobUrls = blobUrlsRef.current;
    return () => {
      blobUrls.forEach((blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
      blobUrls.clear();
    };
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

    if (!file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    if (form.thumbnail.startsWith('blob:')) {
      URL.revokeObjectURL(form.thumbnail);
      blobUrlsRef.current.delete(form.thumbnail);
    }

    setErrorMessage(null);

    const blobUrl = URL.createObjectURL(file);
    blobUrlsRef.current.add(blobUrl);
    setThumbnailFile(file);
    setForm((prev) => ({ ...prev, thumbnail: blobUrl }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPendingImages = async (content: JSONContent): Promise<JSONContent> => {
    const entries = Array.from(pendingImages.entries());
    if (entries.length === 0) {
      return content;
    }

    const urlMap = new Map<string, string>();

    for (const [blobUrl, file] of entries) {
      try {
        const response = await uploadApi.uploadFile(file);
        urlMap.set(blobUrl, response.url);
      } catch (error) {
        console.error('Failed to upload image:', error);
        throw new Error('이미지 업로드에 실패했습니다.');
      }
    }

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

    const replaced = replaceUrls(content);

    entries.forEach(([blobUrl]) => {
      URL.revokeObjectURL(blobUrl);
      blobUrlsRef.current.delete(blobUrl);
    });

    return replaced;
  };

  const prepareContent = async () => {
    let thumbnailUrl = form.thumbnail.trim();
    let hasUploadedThumbnail = false;

    if (thumbnailFile && thumbnailUrl.startsWith('blob:')) {
      const response = await uploadApi.uploadFile(thumbnailFile);
      thumbnailUrl = response.url;
      URL.revokeObjectURL(form.thumbnail);
      blobUrlsRef.current.delete(form.thumbnail);
      hasUploadedThumbnail = true;
    }

    const hasPendingInlineImages = pendingImages.size > 0;
    let finalContent = form.content;
    if (hasPendingInlineImages) {
      finalContent = await uploadPendingImages(form.content);
    }

    if (hasUploadedThumbnail || hasPendingInlineImages) {
      setForm((prev) => ({
        ...prev,
        thumbnail: thumbnailUrl,
        content: finalContent,
      }));
      setThumbnailFile(null);
      if (hasPendingInlineImages) {
        setPendingImages(new Map());
      }
    }

    return { thumbnailUrl, finalContent };
  };

  const updateExistingPost = async ({
    postId: targetPostId,
    title,
    thumbnailUrl,
    finalContent,
    status,
  }: {
    postId: string;
    title: string;
    thumbnailUrl: string;
    finalContent: JSONContent;
    status?: PostStatus;
  }) => {
    // Keep publish transition safer: update content first, then metadata/status.
    await postApi.updateContent(targetPostId, {
      blocks: tiptapToApi(finalContent),
    });

    await postApi.update(targetPostId, {
      title,
      category_id: form.categoryId || undefined,
      thumbnail: thumbnailUrl || undefined,
      ...(status ? { status } : {}),
    });
  };

  const handleSaveDraft = async () => {
    if (!canSaveDraft) return;

    setIsSavingDraft(true);
    setErrorMessage(null);

    try {
      const { thumbnailUrl, finalContent } = await prepareContent();

      if (mode.type === 'new') {
        const createContent = buildCreateContentPayload(finalContent);
        const created = await postApi.create({
          title: form.title.trim() || 'Untitled',
          content: createContent,
          category_id: form.categoryId || undefined,
          thumbnail: thumbnailUrl || undefined,
          status: 'DRAFT',
        });

        migrateToServerDraft();
        setMode({ type: 'draft', postId: created.id, post: created });
        router.replace(`/write?draft=${created.id}`);
      } else {
        await updateExistingPost({
          postId: mode.postId,
          title: form.title.trim() || 'Untitled',
          thumbnailUrl,
          finalContent,
        });
      }

      setThumbnailFile(null);
      setPendingImages(new Map());
      toast.success('Draft saved');
    } catch (error) {
      if (error instanceof ApiException) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        setErrorMessage('An error occurred while saving draft.');
        toast.error('An error occurred while saving draft.');
      }
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!canSubmit) return;

    setIsPublishing(true);
    setErrorMessage(null);

    try {
      const { thumbnailUrl, finalContent } = await prepareContent();

      let postIdToRedirect: string;

      if (mode.type === 'new') {
        const createContent = buildCreateContentPayload(finalContent);
        const created = await postApi.create({
          title: form.title.trim(),
          content: createContent,
          category_id: form.categoryId || undefined,
          thumbnail: thumbnailUrl || undefined,
          status: 'PUBLISHED',
        });
        postIdToRedirect = created.id;
        migrateToServerDraft();
      } else {
        await updateExistingPost({
          postId: mode.postId,
          title: form.title.trim(),
          thumbnailUrl,
          finalContent,
          status: 'PUBLISHED',
        });
        postIdToRedirect = mode.postId;
      }

      setThumbnailFile(null);
      setPendingImages(new Map());
      clearDraft();
      router.push(`/posts/${postIdToRedirect}`);
    } catch (error) {
      if (error instanceof ApiException) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        setErrorMessage('An error occurred while publishing.');
        toast.error('An error occurred while publishing.');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 pb-16">
      <header className="border-line bg-background border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground font-mono text-sm">/ META</h2>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <label className="block space-y-2">
              <span className="text-gray-foreground font-mono text-xs">TITLE</span>
              <input
                value={form.title}
                onChange={onChangeField('title')}
                placeholder="제목을 입력하세요"
                className="border-line bg-background text-foreground w-full border px-3 py-2 text-sm outline-none"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-gray-foreground font-mono text-xs">CATEGORY</span>
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
          </div>

          <div className="w-full space-y-2 md:w-80">
            <span className="text-gray-foreground font-mono text-xs">THUMBNAIL</span>
            <div className="border-line bg-gray-2/30 relative flex aspect-video items-center justify-center border">
              {form.thumbnail ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveAssetUrl(form.thumbnail)}
                    alt="Thumbnail preview"
                    className="h-full w-full object-cover"
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
                        blobUrlsRef.current.delete(form.thumbnail);
                      }
                      setThumbnailFile(null);
                      setForm((prev) => ({ ...prev, thumbnail: '' }));
                    }}
                    className="bg-background/80 text-foreground hover:bg-background absolute top-2 right-2 px-2 py-1 font-mono text-xs transition-colors"
                  >
                    REMOVE
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray hover:text-foreground flex flex-col items-center gap-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span className="font-mono text-xs">SELECT IMAGE</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
            <input
              value={form.thumbnail}
              onChange={onChangeField('thumbnail')}
              placeholder="또는 URL 입력..."
              className="border-line bg-background text-foreground placeholder:text-gray w-full border px-3 py-2 text-xs outline-none"
            />
          </div>
        </div>
      </header>

      <div className="border-line bg-background flex min-h-[500px] flex-col border">
        <TiptapEditor
          content={form.content}
          onChange={(content) => setForm((prev) => ({ ...prev, content }))}
          onImageAdded={(blobUrl, file) => {
            blobUrlsRef.current.add(blobUrl);
            setPendingImages((prev) => new Map(prev).set(blobUrl, file));
          }}
        />
      </div>

      <div className="border-line bg-background fixed right-0 bottom-0 left-0 border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="text-gray-foreground font-mono text-xs">
            {isReady ? formatSavedTime(lastSavedAt) : '임시저장 초기화 중'}
          </div>

          <div className="flex items-center gap-3">
            {errorMessage && <p className="font-mono text-xs text-red-500">{errorMessage}</p>}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={!canSaveDraft}
              className="border-line text-foreground hover:bg-gray-2 border px-4 py-2 font-mono text-sm transition-colors disabled:opacity-40"
            >
              {isSavingDraft ? 'SAVING...' : 'SAVE DRAFT'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={!canSubmit}
              className="bg-foreground text-background hover:bg-foreground/80 px-6 py-2 font-mono text-sm transition-colors disabled:opacity-40"
            >
              {isPublishing ? 'PUBLISHING...' : 'PUBLISH'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
