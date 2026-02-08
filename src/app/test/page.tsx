import { PostBlock } from '@/shared/types/api';
import PostContent from '@/domain/post-detail/components/post-content';
import TableOfContents from '@/domain/post-detail/components/table-of-contents';
import { extractTocFromBlocks } from '@/shared/lib/toc';

// 모든 마크다운 요소를 포함한 테스트 블록
const testBlocks: PostBlock[] = [
  {
    id: 'block-1',
    content: '# H1 제목 - 가장 큰 제목',
    rank_order: 'a',
  },
  {
    id: 'block-2',
    content: '이것은 일반 문단입니다. **굵은 텍스트**, *기울임 텍스트*, ~~취소선~~, `인라인 코드`를 포함합니다.',
    rank_order: 'b',
  },
  {
    id: 'block-3',
    content: '## H2 제목 - 두 번째 레벨',
    rank_order: 'c',
  },
  {
    id: 'block-4',
    content: '### H3 제목 - 세 번째 레벨',
    rank_order: 'd',
  },
  {
    id: 'block-5',
    content: '#### H4 제목\n##### H5 제목\n###### H6 제목',
    rank_order: 'e',
  },
  {
    id: 'block-6',
    content: '## 링크와 이미지',
    rank_order: 'f',
  },
  {
    id: 'block-7',
    content: '[외부 링크 - Google](https://google.com)와 [내부 링크](/posts)를 테스트합니다.',
    rank_order: 'g',
  },
  {
    id: 'block-8',
    content: '![테스트 이미지](https://via.placeholder.com/800x400?text=Test+Image)',
    rank_order: 'h',
  },
  {
    id: 'block-9',
    content: '## 목록',
    rank_order: 'i',
  },
  {
    id: 'block-10',
    content: `순서 없는 목록:
- 첫 번째 항목
- 두 번째 항목
  - 중첩된 항목 1
  - 중첩된 항목 2
- 세 번째 항목`,
    rank_order: 'j',
  },
  {
    id: 'block-11',
    content: `순서 있는 목록:
1. 첫 번째
2. 두 번째
3. 세 번째`,
    rank_order: 'k',
  },
  {
    id: 'block-12',
    content: `체크박스 (GFM):
- [x] 완료된 작업
- [ ] 미완료 작업
- [ ] 또 다른 작업`,
    rank_order: 'l',
  },
  {
    id: 'block-13',
    content: '## 인용문',
    rank_order: 'm',
  },
  {
    id: 'block-14',
    content: `> 이것은 인용문입니다.
> 여러 줄에 걸쳐 작성할 수 있습니다.
>
> — 작성자`,
    rank_order: 'n',
  },
  {
    id: 'block-15',
    content: '## 코드 블록',
    rank_order: 'o',
  },
  {
    id: 'block-16',
    content: `\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\``,
    rank_order: 'p',
  },
  {
    id: 'block-17',
    content: `\`\`\`javascript
// JavaScript 예제
const fetchData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  console.log(data);
};
\`\`\``,
    rank_order: 'q',
  },
  {
    id: 'block-18',
    content: `\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
\`\`\``,
    rank_order: 'r',
  },
  {
    id: 'block-19',
    content: `\`\`\`bash
npm install
npm run dev
npm run build
\`\`\``,
    rank_order: 's',
  },
  {
    id: 'block-20',
    content: '## 테이블',
    rank_order: 't',
  },
  {
    id: 'block-21',
    content: `| 이름 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| title | string | 제목 |
| content | string | 내용 |
| created_at | Date | 생성일 |`,
    rank_order: 'u',
  },
  {
    id: 'block-22',
    content: '## 구분선',
    rank_order: 'v',
  },
  {
    id: 'block-23',
    content: '위 섹션과 아래 섹션을 구분합니다.',
    rank_order: 'w',
  },
  {
    id: 'block-24',
    content: '---',
    rank_order: 'x',
  },
  {
    id: 'block-25',
    content: '구분선 아래의 내용입니다.',
    rank_order: 'y',
  },
  {
    id: 'block-26',
    content: '## 복합 요소',
    rank_order: 'z',
  },
  {
    id: 'block-27',
    content: `다양한 요소를 조합한 문단입니다:

1. **굵은 텍스트**와 함께 [링크](https://example.com)
2. \`코드\`와 *기울임*을 함께
3. ~~취소선~~과 일반 텍스트

> 인용문 안에서도 **굵은 텍스트**와 \`코드\`를 사용할 수 있습니다.`,
    rank_order: 'za',
  },
  {
    id: 'block-28',
    content: '## 긴 문단 테스트',
    rank_order: 'zb',
  },
  {
    id: 'block-29',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

한글 긴 문단 테스트입니다. 블로그 포스트에서 자주 사용되는 긴 문단의 가독성을 확인합니다. 적절한 줄 간격과 문단 간격이 적용되어 있는지 확인할 수 있습니다. 다크 모드와 라이트 모드에서 모두 읽기 편한지 테스트해보세요.`,
    rank_order: 'zc',
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
            <time className="text-gray-foreground pb-3 font-mono text-sm font-semibold">
              2025.01.26
            </time>
            <h1 className="text-foreground mb-4 text-5xl font-bold">
              마크다운 요소 테스트 페이지
            </h1>
            <p className="text-gray-foreground">
              모든 마크다운 요소의 스타일을 확인하는 테스트 페이지입니다.
            </p>
          </header>

          <PostContent blocks={testBlocks} postId="test-post" />
        </div>

        {/* TOC 사이드바 */}
        <TableOfContents toc={toc} />
      </div>
    </div>
  );
}
