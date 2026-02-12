'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditableBlockIdExtension } from '@/shared/lib/tiptap-extensions';
import CodeBlockComponent from './code-block-component';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
  onImageAdded?: (blobUrl: string, file: File) => void;
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
        isActive ? 'bg-foreground text-background' : 'text-foreground hover:bg-gray-2'
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({
  content,
  onChange,
  onImageAdded,
  placeholder = "'/'를 입력하여 명령어 사용...",
}: TiptapEditorProps) {
  const isInitialMount = useRef(true);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        resize: {
          enabled: true,
          minWidth: 100,
          alwaysPreserveAspectRatio: true,
        },
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
      }),
      EditableBlockIdExtension,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    // Create blob URL for preview
    const blobUrl = URL.createObjectURL(file);

    // Insert image with blob URL
    editor.chain().focus().setImage({ src: blobUrl }).run();

    // Notify parent component
    onImageAdded?.(blobUrl, file);

    // Reset file input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

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

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          B
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          I
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
          S
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')}>
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

        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>HR</ToolbarButton>

        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <ToolbarButton onClick={() => imageInputRef.current?.click()}>IMAGE</ToolbarButton>
      </div>

      {/* Editor */}
      <div className="min-h-0 flex-1 overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
