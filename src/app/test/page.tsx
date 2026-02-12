import PostContent from '@/domain/post-detail/components/post-content';
import TableOfContents from '@/domain/post-detail/components/table-of-contents';
import CommentsSection from '@/domain/post-detail/components/comments-section';
import { extractTocFromBlocks } from '@/shared/lib/toc';
import type { PostBlock } from '@/shared/types/api';

// 테스트용 블록 데이터 (API 응답 형태)
const testBlocks: PostBlock[] = [
  {
    id: 'block-1',
    rank_order: 'a',
    content: {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'H1 제목 - 가장 큰 제목' }],
    },
  },
  {
    id: 'block-2',
    rank_order: 'b',
    content: {
      type: 'paragraph',
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
  },
  {
    id: 'block-3',
    rank_order: 'c',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'H2 제목 - 두 번째 레벨' }],
    },
  },
  {
    id: 'block-4',
    rank_order: 'd',
    content: {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'H3 제목 - 세 번째 레벨' }],
    },
  },
  {
    id: 'block-5',
    rank_order: 'e',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '목록' }],
    },
  },
  {
    id: 'block-6',
    rank_order: 'f',
    content: {
      type: 'paragraph',
      content: [{ type: 'text', text: '순서 없는 목록:' }],
    },
  },
  {
    id: 'block-7',
    rank_order: 'g',
    content: {
      type: 'bulletList',
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
  },
  {
    id: 'block-8',
    rank_order: 'h',
    content: {
      type: 'paragraph',
      content: [{ type: 'text', text: '순서 있는 목록:' }],
    },
  },
  {
    id: 'block-9',
    rank_order: 'i',
    content: {
      type: 'orderedList',
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
  },
  {
    id: 'block-10',
    rank_order: 'j',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '인용문' }],
    },
  },
  {
    id: 'block-11',
    rank_order: 'k',
    content: {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '이것은 인용문입니다. 여러 줄에 걸쳐 작성할 수 있습니다. — 작성자' }],
        },
      ],
    },
  },
  {
    id: 'block-12',
    rank_order: 'l',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '코드 블록' }],
    },
  },
  {
    id: 'block-13',
    rank_order: 'm',
    content: {
      type: 'codeBlock',
      attrs: { language: 'typescript' },
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
  },
  {
    id: 'block-14',
    rank_order: 'n',
    content: {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
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
  },
  {
    id: 'block-15',
    rank_order: 'o',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '구분선' }],
    },
  },
  {
    id: 'block-16',
    rank_order: 'p',
    content: {
      type: 'paragraph',
      content: [{ type: 'text', text: '위 섹션과 아래 섹션을 구분합니다.' }],
    },
  },
  {
    id: 'block-17',
    rank_order: 'q',
    content: {
      type: 'horizontalRule',
    },
  },
  {
    id: 'block-18',
    rank_order: 'r',
    content: {
      type: 'paragraph',
      content: [{ type: 'text', text: '구분선 아래의 내용입니다.' }],
    },
  },
  {
    id: 'block-19',
    rank_order: 's',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '긴 문단 테스트' }],
    },
  },
  {
    id: 'block-20',
    rank_order: 't',
    content: {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
      ],
    },
  },
  {
    id: 'block-21',
    rank_order: 'u',
    content: {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '한글 긴 문단 테스트입니다. 블로그 포스트에서 자주 사용되는 긴 문단의 가독성을 확인합니다. 적절한 줄 간격과 문단 간격이 적용되어 있는지 확인할 수 있습니다.',
        },
      ],
    },
  },
];

export default function TestPage() {
  const toc = extractTocFromBlocks(testBlocks);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-center gap-8">
        {/* 메인 컨텐츠 */}
        <div className="max-w-2xl flex-1">
          <header className="mb-8 flex flex-col pb-8">
            <time className="text-gray-foreground pb-3 font-mono text-sm font-semibold">2025.01.26</time>
            <h1 className="text-foreground mb-4 text-5xl font-bold">Tiptap JSON 기반 렌더링 테스트</h1>
            <p className="text-gray-foreground">Tiptap JSON 구조로 렌더링을 테스트하는 페이지입니다.</p>
          </header>

          <PostContent blocks={testBlocks} postId="test-post" />

          <CommentsSection postId="test-post" />
        </div>

        {/* TOC 사이드바 */}
        <TableOfContents toc={toc} />
      </div>
    </div>
  );
}
