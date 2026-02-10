'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { BlockIdExtension } from '@/shared/lib/tiptap-extensions';
import CommentIndicator from '@/domain/post-detail/components/comment-indicator';
import { createRoot, Root } from 'react-dom/client';

const lowlight = createLowlight(common);

interface PostViewerProps {
  content: JSONContent;
  postId: string;
}

// content에서 최상위 블록 ID 추출
function extractBlockIds(content: JSONContent): string[] {
  if (!content.content) return [];
  return content.content
    .filter((node) => node.attrs?.id)
    .map((node) => node.attrs!.id as string);
}

export default function PostViewer({ content, postId }: PostViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Map<string, Root>>(new Map());

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
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

    const blockIds = extractBlockIds(content);

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
      // cleanup roots
      rootsRef.current.forEach((root) => root.unmount());
      rootsRef.current.clear();
    };
  }, [editor, content, postId]);

  if (!editor) {
    return null;
  }

  return (
    <article ref={containerRef}>
      <EditorContent editor={editor} />
    </article>
  );
}
