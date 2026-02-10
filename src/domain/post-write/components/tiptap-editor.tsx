'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer, JSONContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { v4 as uuidv4 } from 'uuid';
import CodeBlockComponent from './code-block-component';

const lowlight = createLowlight(common);

// 블록 노드에 고유 ID를 부여하는 확장
const UniqueID = Extension.create({
  name: 'uniqueID',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'codeBlock', 'blockquote', 'bulletList', 'orderedList', 'horizontalRule'],
        attributes: {
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-id'),
            renderHTML: (attributes) => {
              if (!attributes.id) {
                return { 'data-id': uuidv4() };
              }
              return { 'data-id': attributes.id };
            },
          },
        },
      },
    ];
  },

  onCreate() {
    // 에디터 생성 시 ID가 없는 노드에 ID 부여
    const { tr } = this.editor.state;
    let modified = false;

    this.editor.state.doc.descendants((node, pos) => {
      if (node.type.spec.group === 'block' && !node.attrs.id) {
        tr.setNodeMarkup(pos, undefined, { ...node.attrs, id: uuidv4() });
        modified = true;
      }
    });

    if (modified) {
      this.editor.view.dispatch(tr);
    }
  },
});

interface TiptapEditorProps {
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-1 font-mono text-xs transition-colors ${
        isActive
          ? 'bg-foreground text-background'
          : 'text-foreground hover:bg-gray-2'
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "'/'를 입력하여 명령어 사용...",
}: TiptapEditorProps) {
  const isInitialMount = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
      }),
      UniqueID,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor prose-custom outline-none min-h-[500px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  // 초기 콘텐츠가 나중에 로드될 때 에디터에 반영
  useEffect(() => {
    if (editor && content && isInitialMount.current) {
      const currentJSON = editor.getJSON();
      // 에디터가 비어있고 content가 있을 때만 설정
      if (currentJSON.content?.length === 1 && !currentJSON.content[0].content) {
        editor.commands.setContent(content);
      }
      isInitialMount.current = false;
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-line flex flex-wrap gap-1 border-b p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
        >
          H3
        </ToolbarButton>

        <div className="bg-line mx-1 w-px" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
        >
          S
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
        >
          {'</>'}
        </ToolbarButton>

        <div className="bg-line mx-1 w-px" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          UL
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          OL
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        >
          Quote
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
        >
          Code
        </ToolbarButton>

        <div className="bg-line mx-1 w-px" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          HR
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="min-h-0 flex-1 overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
