# MDX 포스팅 시스템 - remark/rehype 개선판

이 문서는 remark/rehype 라이브러리를 활용하여 개선된 MDX 포스팅 시스템에 대한 완전한 가이드입니다.

## 🎯 개선 목표

기존 `next-mdx-remote-client` 방식에서 `remark/rehype` 기반으로 개선하여:
- 더 안정적이고 표준화된 MDX 처리
- 자동화된 헤딩 ID 생성
- 풍부한 플러그인 생태계 활용
- 서버사이드 HTML 변환으로 성능 향상

## 📦 새로 설치된 라이브러리

### Core Libraries
```bash
npm install unified remark rehype
```

- **unified**: 구문 트리 변환을 위한 통합 인터페이스
- **remark**: Markdown 처리 파이프라인
- **rehype**: HTML 처리 파이프라인

### Parsers & Compilers
```bash
npm install remark-parse remark-rehype rehype-stringify
```

- **remark-parse**: Markdown을 구문 트리로 파싱
- **remark-rehype**: Markdown AST를 HTML AST로 변환
- **rehype-stringify**: HTML AST를 HTML 문자열로 변환

### Plugins
```bash
npm install rehype-slug rehype-autolink-headings remark-gfm rehype-highlight rehype-raw
```

- **rehype-slug**: 헤딩에 자동으로 ID 생성 (kebab-case)
- **rehype-autolink-headings**: 헤딩을 링크로 감싸기
- **remark-gfm**: GitHub Flavored Markdown 지원 (테이블, 체크박스, 취소선 등)
- **rehype-highlight**: highlight.js를 사용한 코드 하이라이팅
- **rehype-raw**: Markdown 내 HTML 태그 허용

## 🏗️ 시스템 아키텍처

### 처리 파이프라인
```
MDX 파일 → remark-parse → remark-gfm → remark-rehype → rehype-raw → rehype-slug → rehype-autolink-headings → rehype-highlight → rehype-stringify → HTML
```

### 프로젝트 구조
```
src/
├── app/
│   └── posts/
│       ├── page.tsx              # 포스트 목록 페이지  
│       └── [slug]/
│           └── page.tsx          # 개별 포스트 페이지
├── domain/
│   └── post-detail/
│       └── components/
│           ├── post-header.tsx           # 포스트 메타데이터 헤더
│           ├── post-content.tsx          # HTML 렌더링 컴포넌트
│           ├── table-of-contents.tsx     # 목차 컴포넌트 (개선됨)
│           ├── comments-section.tsx      # 통합 댓글 시스템
│           └── comment-indicator.tsx     # 댓글 표시 컴포넌트
└── shared/
    └── lib/
        └── mdx.ts               # remark/rehype 기반 MDX 처리
```

## 🔧 핵심 기능

### 1. 자동 MDX 처리 (`src/shared/lib/mdx.ts`)

```typescript
const createProcessor = () => {
  return unified()
    .use(remarkParse)                    // Markdown 파싱
    .use(remarkGfm)                      // GitHub Flavored Markdown
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)                      // HTML 태그 허용
    .use(rehypeSlug)                     // 헤딩 ID 자동 생성
    .use(rehypeAutolinkHeadings, {       // 헤딩 링크화
      behavior: 'wrap',
      properties: { className: ['heading-link'] }
    })
    .use(rehypeHighlight, {              // 코드 하이라이팅
      detect: true,
      ignoreMissing: true
    })
    .use(rehypeStringify);               // HTML 출력
};
```

#### 주요 함수들:
- `getMDXContent(slug)`: MDX 파일을 HTML과 메타데이터로 변환
- `extractToc(content)`: Markdown에서 목차 자동 추출
- `addParagraphIds(html)`: 문단에 고유 ID 추가 (댓글 기능용)

### 2. 개선된 목차 시스템

**자동 TOC 생성**:
- Markdown 헤딩(H1-H6)에서 자동 추출
- `rehype-slug`로 일관된 ID 생성
- 스크롤 동기화로 현재 위치 표시

**반응형 디자인**:
- 데스크톱: 우측 고정 사이드바
- 모바일: 플로팅 버튼으로 오버레이

### 3. 개선된 댓글 시스템

**문단별 댓글**:
- 각 문단 호버 시 댓글 버튼 표시
- 클릭 시 하단 댓글 섹션으로 자동 스크롤
- 문단별 독립적 댓글 관리

**통합 댓글 관리**:
- 모든 댓글을 페이지 하단에서 통합 관리
- 문단별 댓글 개수 표시
- 문단 선택 및 댓글 작성 UI

### 4. 코드 하이라이팅

**highlight.js 통합**:
- 자동 언어 감지
- GitHub Dark 테마 적용
- 커스텀 스타일링으로 디자인 통합

**지원 기능**:
```markdown
```javascript
const example = () => {
  console.log('자동 하이라이팅!');
};
```
```

## 🎨 스타일링 시스템

### CSS 변수 활용
모든 스타일이 기존 디자인 시스템의 CSS 변수를 사용:

```css
.prose h1 {
  color: var(--color-foreground);
}

.toc-item.active {
  color: var(--color-primary);
}
```

### 다크모드 지원
자동으로 라이트/다크 모드에 대응:
- 텍스트: `var(--color-foreground)`
- 배경: `var(--color-background)`
- 강조: `var(--color-primary)`
- 보더: `var(--color-line)`

### 호버 효과
```css
.paragraph-hover:hover .comment-indicator {
  opacity: 1;
}
```

## 📝 MDX 파일 작성 가이드

### Front Matter 구조
```yaml
---
title: "포스트 제목"
date: "2025-01-26"
description: "포스트 설명"
category: "카테고리"
tags: ["태그1", "태그2"]
---
```

### 지원되는 Markdown 문법

#### 기본 문법
```markdown
# 제목 1 (자동 ID: 제목-1)
## 제목 2 (자동 ID: 제목-2)

**굵은 텍스트**
*기울임 텍스트*
`인라인 코드`

> 인용구

- 목록 아이템
- 목록 아이템

1. 번호 목록
2. 번호 목록
```

#### GitHub Flavored Markdown
```markdown
| 헤더1 | 헤더2 |
|-------|-------|
| 셀1   | 셀2   |

- [x] 완료된 작업
- [ ] 미완료 작업

~~취소선~~
```

#### 코드 블록
````markdown
```javascript
const greeting = (name) => {
  return `Hello, ${name}!`;
};
```
````

## 🚀 사용 방법

### 1. 새 포스트 작성
```bash
# content/posts/ 디렉토리에 MDX 파일 생성
touch content/posts/my-new-post.mdx
```

### 2. 포스트 내용 작성
```markdown
---
title: "새로운 포스트"
date: "2025-01-26"
description: "포스트 설명"
category: "기술"
tags: ["Next.js", "MDX"]
---

# 포스트 제목

포스트 내용을 여기에 작성합니다.

## 섹션 1

각 문단에 마우스를 올리면 댓글 버튼이 나타납니다.

## 섹션 2

목차는 자동으로 생성됩니다.
```

### 3. 포스트 접근
브라우저에서 `/posts/my-new-post` 로 접근

### 4. 댓글 사용법
1. 원하는 문단에 마우스 호버
2. 나타나는 댓글 버튼 클릭
3. 페이지 하단으로 자동 스크롤
4. 이름과 댓글 입력 후 작성

## ⚡ 성능 최적화

### 서버사이드 처리
- MDX → HTML 변환이 빌드 타임에 실행
- 클라이언트에서는 HTML만 렌더링
- 초기 로딩 속도 향상

### 스타일 최적화
- CSS 변수 활용으로 일관된 테마
- Tailwind CSS와 통합된 유틸리티
- 커스텀 스크롤바로 UX 개선

### 메모리 효율성
- 로컬 스토리지 기반 댓글 저장
- 이벤트 기반 컴포넌트 통신
- 불필요한 리렌더링 방지

## 🔍 문제 해결

### 자주 발생하는 이슈

**1. 코드 하이라이팅이 안 됨**
```bash
# highlight.js CSS가 로드되었는지 확인
# globals.css에서 @import 'highlight.js/styles/github-dark.css' 확인
```

**2. 목차가 생성되지 않음**
```markdown
# 헤딩 앞에 공백이 있는지 확인
## 특수문자가 포함된 헤딩은 ID 생성에서 제외됨
```

**3. 댓글이 저장되지 않음**
```javascript
// 브라우저 로컬 스토리지 확인
localStorage.getItem('comments_post-slug_paragraph-id')
```

**4. 스타일이 적용되지 않음**
```css
/* CSS 변수가 정의되어 있는지 확인 */
:root {
  --color-foreground: #1f1f1e;
  --color-background: #f8f8f5;
}
```

## 🔮 향후 개선 계획

### 단기 계획
- [ ] 댓글 서버 연동
- [ ] 검색 기능 추가
- [ ] 댓글 수정/답글 기능
- [ ] 소셜 미디어 공유

### 장기 계획
- [ ] 실시간 댓글 동기화
- [ ] 댓글 알림 시스템
- [ ] 포스트 추천 시스템
- [ ] 다국어 지원

## 📚 참고 자료

- [unified.js 공식 문서](https://unifiedjs.com/)
- [remark 플러그인](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [rehype 플러그인](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
- [highlight.js 언어 지원](https://highlightjs.org/static/demo/)
- [GitHub Flavored Markdown 스펙](https://github.github.com/gfm/)

---

이 시스템은 확장성과 유지보수성을 고려하여 설계되었으며, 추가 플러그인이나 기능을 쉽게 통합할 수 있습니다.