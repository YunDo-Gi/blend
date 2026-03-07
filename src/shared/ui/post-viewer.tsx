'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useSearchParams } from 'next/navigation';
import { BlockIdExtension } from '@/shared/lib/tiptap-extensions';
import { apiToTiptap, extractBlockIdsFromApi } from '@/shared/lib/block-transform';
import CommentIndicator from '@/domain/post-detail/components/comment-indicator';
import { createRoot, Root } from 'react-dom/client';
import { getReadingProgress, saveReadingProgress } from '@/shared/lib/reading-progress';
import type { PostBlock } from '@/shared/types/api';

const lowlight = createLowlight(common);

interface PostViewerMeta {
  title?: string;
  author?: string;
  thumbnail?: string;
  category?: string;
}

interface PostViewerProps {
  blocks: PostBlock[];
  postId: string;
  postMeta?: PostViewerMeta;
}

export default function PostViewer({ blocks, postId, postMeta }: PostViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Map<string, Root>>(new Map());
  const searchParams = useSearchParams();
  const shouldResume = searchParams.get('resume') === '1';
  const [isResumeReady, setIsResumeReady] = useState(!shouldResume);

  // blocks → Tiptap JSON 변환
  const content = useMemo(() => apiToTiptap(blocks), [blocks]);
  const blockIds = useMemo(() => extractBlockIdsFromApi(blocks), [blocks]);
  const blockIndexMap = useMemo(() => new Map(blockIds.map((id, index) => [id, index])), [blockIds]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              parseHTML: (element) => element.getAttribute('width'),
              renderHTML: (attributes) => {
                if (!attributes.width) {
                  return {};
                }
                return { width: attributes.width };
              },
            },
          };
        },
      }).configure({
        inline: false,
        allowBase64: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      BlockIdExtension,
    ],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose-custom outline-none',
      },
    },
  });

  useEffect(() => {
    setIsResumeReady(!shouldResume);
  }, [postId, shouldResume]);

  // 에디터 렌더링 후 댓글 버튼 추가
  useEffect(() => {
    if (!editor || !containerRef.current) return;
    const commentRoots = rootsRef.current;

    const addCommentButtons = () => {
      blockIds.forEach((blockId) => {
        const block = containerRef.current?.querySelector(`[data-block-id="${blockId}"]`);
        if (!block) return;

        // relative 클래스 추가
        block.classList.add('relative');

        // 이미 버튼이 있으면 스킵
        if (block.querySelector('.comment-indicator-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'comment-indicator-wrapper';

        const root = createRoot(wrapper);
        root.render(<CommentIndicator postSlug={postId} paragraphId={blockId} />);
        commentRoots.set(blockId, root);

        block.appendChild(wrapper);
      });
    };

    // 에디터가 업데이트될 때마다 버튼 추가
    const timeoutId = setTimeout(addCommentButtons, 100);

    return () => {
      clearTimeout(timeoutId);
      // cleanup roots - 비동기로 처리하여 race condition 방지
      const roots = Array.from(commentRoots.values());
      commentRoots.clear();
      setTimeout(() => {
        roots.forEach((root) => root.unmount());
      }, 0);
    };
  }, [editor, blockIds, postId]);

  useEffect(() => {
    if (!editor || !containerRef.current || blockIds.length === 0) return;

    const timeoutId = window.setTimeout(() => {
      if (!shouldResume) {
        setIsResumeReady(true);
        return;
      }

      const saved = getReadingProgress(postId);
      if (!saved?.lastBlockId) {
        setIsResumeReady(true);
        return;
      }

      const target = containerRef.current?.querySelector<HTMLElement>(`[data-block-id="${saved.lastBlockId}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setIsResumeReady(true);
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [blockIds, editor, postId, shouldResume]);

  useEffect(() => {
    if (!editor || !containerRef.current || blockIds.length === 0 || !isResumeReady) return;
    let observer: IntersectionObserver | null = null;
    const timeoutId = window.setTimeout(() => {
      const trackedBlocks = blockIds
        .map((blockId) => containerRef.current?.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`))
        .filter((block): block is HTMLElement => Boolean(block));

      if (trackedBlocks.length === 0) return;

      let lastTrackedBlockId = '';
      observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter((entry) => entry.isIntersecting);
          if (visibleEntries.length === 0) return;

          const nextEntry = visibleEntries.sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight * 0.28) -
              Math.abs(b.boundingClientRect.top - window.innerHeight * 0.28),
          )[0];

          const blockId = nextEntry.target.getAttribute('data-block-id');
          if (!blockId || blockId === lastTrackedBlockId) return;

          lastTrackedBlockId = blockId;
          const blockIndex = blockIndexMap.get(blockId);
          if (blockIndex === undefined) return;

          saveReadingProgress({
            postId,
            title: postMeta?.title || 'Untitled',
            author: postMeta?.author,
            category: postMeta?.category,
            thumbnail: postMeta?.thumbnail,
            lastBlockId: blockId,
            progress: Math.max(1, Math.round(((blockIndex + 1) / blockIds.length) * 100)),
            updatedAt: new Date().toISOString(),
          });
        },
        {
          rootMargin: '-10% 0px -55% 0px',
          threshold: [0.15, 0.45, 0.75],
        },
      );

      trackedBlocks.forEach((block) => observer?.observe(block));
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [blockIds, blockIndexMap, editor, isResumeReady, postId, postMeta]);

  if (!editor) {
    return null;
  }

  return (
    <article ref={containerRef}>
      <EditorContent editor={editor} />
    </article>
  );
}
