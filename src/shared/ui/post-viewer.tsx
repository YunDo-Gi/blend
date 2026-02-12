'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { BlockIdExtension } from '@/shared/lib/tiptap-extensions';
import { apiToTiptap, extractBlockIdsFromApi } from '@/shared/lib/block-transform';
import CommentIndicator from '@/domain/post-detail/components/comment-indicator';
import { createRoot, Root } from 'react-dom/client';
import type { PostBlock } from '@/shared/types/api';

const lowlight = createLowlight(common);

interface PostViewerProps {
  blocks: PostBlock[];
  postId: string;
}

export default function PostViewer({ blocks, postId }: PostViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Map<string, Root>>(new Map());

  // blocks → Tiptap JSON 변환
  const content = useMemo(() => apiToTiptap(blocks), [blocks]);
  const blockIds = useMemo(() => extractBlockIdsFromApi(blocks), [blocks]);

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

  // 에디터 렌더링 후 댓글 버튼 추가
  useEffect(() => {
    if (!editor || !containerRef.current) return;

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
        rootsRef.current.set(blockId, root);

        block.appendChild(wrapper);
      });
    };

    // 에디터가 업데이트될 때마다 버튼 추가
    const timeoutId = setTimeout(addCommentButtons, 100);

    return () => {
      clearTimeout(timeoutId);
      // cleanup roots - 비동기로 처리하여 race condition 방지
      const roots = Array.from(rootsRef.current.values());
      rootsRef.current.clear();
      setTimeout(() => {
        roots.forEach((root) => root.unmount());
      }, 0);
    };
  }, [editor, blockIds, postId]);

  if (!editor) {
    return null;
  }

  return (
    <article ref={containerRef}>
      <EditorContent editor={editor} />
    </article>
  );
}
