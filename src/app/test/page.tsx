import type { JSONContent } from '@tiptap/react';
import PostContent from '@/domain/post-detail/components/post-content';
import TableOfContents from '@/domain/post-detail/components/table-of-contents';
import { extractTocFromContent } from '@/shared/lib/toc';

// Tiptap JSON 테스트 데이터
const testContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { id: 'block-1', level: 1 },
      content: [{ type: 'text', text: 'H1 제목 - 가장 큰 제목' }],
    },
    {
      type: 'paragraph',
      attrs: { id: 'block-2' },
      content: [
        { type: 'text', text: '이것은 일반 문단입니다. ' },
        { type: 'text', marks: [{ type: 'bold' }], text: '굵은 텍스트' },
        { type: 'text', text: ', ' },
        { type: 'text', marks: [{ type: 'italic' }], text: '기울임 텍스트' },
        { type: 'text', text: ', ' },
        { type: 'text', marks: [{ type: 'strike' }], text: '취소선' },
        { type: 'text', text: ', ' },
        { type: 'text', marks: [{ type: 'code' }], text: '인라인 코드' },
        { type: 'text', text: '를 포함합니다.' },
      ],
    },
    {
      type: 'heading',
      attrs: { id: 'block-3', level: 2 },
      content: [{ type: 'text', text: 'H2 제목 - 두 번째 레벨' }],
    },
    {
      type: 'heading',
      attrs: { id: 'block-4', level: 3 },
      content: [{ type: 'text', text: 'H3 제목 - 세 번째 레벨' }],
    },
    {
      type: 'heading',
      attrs: { id: 'block-5', level: 2 },
      content: [{ type: 'text', text: '목록' }],
    },
    {
      type: 'paragraph',
      attrs: { id: 'block-6' },
      content: [{ type: 'text', text: '순서 없는 목록:' }],
    },
    {
      type: 'bulletList',
      attrs: { id: 'block-7' },
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '첫 번째 항목' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '두 번째 항목' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '세 번째 항목' }] }],
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: { id: 'block-8' },
      content: [{ type: 'text', text: '순서 있는 목록:' }],
    },
    {
      type: 'orderedList',
      attrs: { id: 'block-9' },
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '첫 번째' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '두 번째' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '세 번째' }] }],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { id: 'block-10', level: 2 },
      content: [{ type: 'text', text: '인용문' }],
    },
    {
      type: 'blockquote',
      attrs: { id: 'block-11' },
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '이것은 인용문입니다. 여러 줄에 걸쳐 작성할 수 있습니다. — 작성자' },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { id: 'block-12', level: 2 },
      content: [{ type: 'text', text: '코드 블록' }],
    },
    {
      type: 'codeBlock',
      attrs: { id: 'block-13', language: 'typescript' },
      content: [
        {
          type: 'text',
          text: `interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}`,
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: { id: 'block-14', language: 'javascript' },
      content: [
        {
          type: 'text',
          text: `// JavaScript 예제
const fetchData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  console.log(data);
};`,
        },
      ],
    },
    {
      type: 'heading',
      attrs: { id: 'block-15', level: 2 },
      content: [{ type: 'text', text: '구분선' }],
    },
    {
      type: 'paragraph',
      attrs: { id: 'block-16' },
      content: [{ type: 'text', text: '위 섹션과 아래 섹션을 구분합니다.' }],
    },
    {
      type: 'horizontalRule',
      attrs: { id: 'block-17' },
    },
    {
      type: 'paragraph',
      attrs: { id: 'block-18' },
      content: [{ type: 'text', text: '구분선 아래의 내용입니다.' }],
    },
    {
      type: 'heading',
      attrs: { id: 'block-19', level: 2 },
      content: [{ type: 'text', text: '긴 문단 테스트' }],
    },
    {
      type: 'paragraph',
      attrs: { id: 'block-20' },
      content: [
        {
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: { id: 'block-21' },
      content: [
        {
          type: 'text',
          text: '한글 긴 문단 테스트입니다. 블로그 포스트에서 자주 사용되는 긴 문단의 가독성을 확인합니다. 적절한 줄 간격과 문단 간격이 적용되어 있는지 확인할 수 있습니다.',
        },
      ],
    },
  ],
};

export default function TestPage() {
  const toc = extractTocFromContent(testContent);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-center gap-8">
        {/* 메인 컨텐츠 */}
        <div className="max-w-2xl flex-1">
          <header className="mb-8 flex flex-col pb-8">
            <time className="text-gray-foreground pb-3 font-mono text-sm font-semibold">
              2025.01.26
            </time>
            <h1 className="text-foreground mb-4 text-5xl font-bold">
              Tiptap JSON 기반 렌더링 테스트
            </h1>
            <p className="text-gray-foreground">
              Tiptap JSON 구조로 렌더링을 테스트하는 페이지입니다.
            </p>
          </header>

          <PostContent content={testContent} postId="test-post" />
        </div>

        {/* TOC 사이드바 */}
        <TableOfContents toc={toc} />
      </div>
    </div>
  );
}
