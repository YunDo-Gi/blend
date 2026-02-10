'use client';

import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react';

const LANGUAGES = [
  { value: '', label: 'auto' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'plaintext', label: 'Plain Text' },
];

export default function CodeBlockComponent({
  node,
  updateAttributes,
}: NodeViewProps) {
  return (
    <NodeViewWrapper className="code-block-wrapper relative">
      <select
        contentEditable={false}
        value={node.attrs.language || ''}
        onChange={(e) => updateAttributes({ language: e.target.value })}
        className="absolute right-2 top-2 z-10 rounded border border-gray-600 bg-gray-800 px-2 py-1 font-mono text-xs text-gray-300 outline-none hover:border-gray-500 focus:border-gray-400"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
