import PostContent from '@/domain/post-detail/components/post-content';
import TableOfContents from '@/domain/post-detail/components/table-of-contents';
import CommentsSection from '@/domain/post-detail/components/comments-section';
import PostHeader from '@/domain/post-detail/components/post-header';
import { extractTocFromBlocks } from '@/shared/lib/toc';
import type { Post, PostBlock } from '@/shared/types/api';

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
  {
    id: 'block-22',
    rank_order: 'v',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '하드 브레이크 / 멀티라인 테스트' }],
    },
  },
  {
    id: 'block-23',
    rank_order: 'w',
    content: {
      type: 'paragraph',
      content: [
        { type: 'text', text: '첫 번째 줄' },
        { type: 'hardBreak' },
        { type: 'text', text: '두 번째 줄' },
        { type: 'hardBreak' },
        { type: 'text', text: '세 번째 줄' },
      ],
    },
  },
  {
    id: 'block-24',
    rank_order: 'x',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '중첩 리스트 테스트' }],
    },
  },
  {
    id: 'block-25',
    rank_order: 'y',
    content: {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: '상위 항목 1' }] },
            {
              type: 'orderedList',
              content: [
                {
                  type: 'listItem',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '하위 순서 항목 1-1' }] }],
                },
                {
                  type: 'listItem',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '하위 순서 항목 1-2' }] }],
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '상위 항목 2' }] }],
        },
      ],
    },
  },
  {
    id: 'block-26',
    rank_order: 'z',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '코드 블록 추가 테스트 (bash/json)' }],
    },
  },
  {
    id: 'block-27',
    rank_order: 'aa',
    content: {
      type: 'codeBlock',
      attrs: { language: 'bash' },
      content: [
        {
          type: 'text',
          text: `# bash example
npm run lint
npm run build`,
        },
      ],
    },
  },
  {
    id: 'block-28',
    rank_order: 'ab',
    content: {
      type: 'codeBlock',
      attrs: { language: 'json' },
      content: [
        {
          type: 'text',
          text: `{
  "title": "Test Post",
  "tags": ["tiptap", "json", "render"],
  "published": true
}`,
        },
      ],
    },
  },
  {
    id: 'block-29',
    rank_order: 'ac',
    content: {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '이미지 테스트' }],
    },
  },
  {
    id: 'block-30',
    rank_order: 'ad',
    content: {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '헤더 썸네일에 로컬 SVG 이미지를 설정해 이미지 렌더링까지 함께 테스트합니다.',
        },
      ],
    },
  },
];
const testPost: Post = {
  id: 'test-post',
  title: 'Tiptap JSON 기반 렌더링 테스트',
  author: 'YUNCHEOL KWAK',
  category: 'Backend',
  thumbnail: '/images/lcw-chair.png',
  status: 'PUBLISHED',
  created_at: '2025-01-26T00:00:00Z',
  blocks: testBlocks,
};
export default function TestPage() {
  const toc = extractTocFromBlocks(testBlocks);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-center gap-8">
        {/* 메인 컨텐츠 */}
        <div className="max-w-2xl flex-1">
          <PostHeader post={testPost} />

          <PostContent
            blocks={testBlocks}
            postId={testPost.id}
            postTitle={testPost.title}
            postAuthor={testPost.author}
            postThumbnail={testPost.thumbnail}
            postCategory={testPost.category}
          />

          <CommentsSection postId={testPost.id} />
        </div>

        {/* TOC 사이드바 */}
        <TableOfContents toc={toc} />
      </div>
    </div>
  );
}
