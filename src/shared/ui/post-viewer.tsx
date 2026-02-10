'use client';

import { useEditor, EditorContent, JSONContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import CommentIndicator from '@/domain/post-detail/components/comment-indicator';
import { createRoot } from 'react-dom/client';

const lowlight = createLowlight(common);

// Heading에 id 속성을 렌더링하는 커스텀 확장
const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return { id: attributes.id };
        },
      },
    };
  },
});

interface PostViewerProps {
  content: JSONContent;
  postId: string;
}

// 각 블록 노드에 댓글 인디케이터를 추가하는 확장
const CommentDecorations = (postId: string) =>
  Extension.create({
    name: 'commentDecorations',

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('commentDecorations'),
          props: {
            decorations: (state) => {
              const decorations: Decoration[] = [];
              const { doc } = state;

              doc.descendants((node, pos) => {
                if (node.isBlock && node.attrs.id) {
                  // 블록 노드에 relative, paragraph-hover 클래스와 id 속성 추가
                  const nodeDecoration = Decoration.node(pos, pos + node.nodeSize, {
                    class: 'relative paragraph-hover',
                    id: node.attrs.id,
                  });
                  decorations.push(nodeDecoration);

                  // 블록 시작 부분에 위젯 추가
                  const widget = Decoration.widget(
                    pos + 1,
                    () => {
                      const container = document.createElement('div');
                      container.className = 'comment-indicator-wrapper';
                      container.setAttribute('data-block-id', node.attrs.id);

                      // React 컴포넌트를 DOM에 렌더링
                      const root = createRoot(container);
                      root.render(
                        <CommentIndicator postSlug={postId} paragraphId={node.attrs.id} />
                      );

                      return container;
                    },
                    { side: -1 }
                  );
                  decorations.push(widget);
                }
              });

              return DecorationSet.create(doc, decorations);
            },
          },
        }),
      ];
    },
  });

export default function PostViewer({ content, postId }: PostViewerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
      }),
      CustomHeading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      CommentDecorations(postId),
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

  if (!editor) {
    return null;
  }

  return (
    <article>
      <EditorContent editor={editor} />
    </article>
  );
}
