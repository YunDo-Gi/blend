# MDX 포스팅 시스템 구현 가이드

이 문서는 Next.js와 `next-mdx-remote-client`를 활용하여 구현된 MDX 포스팅 시스템에 대한 상세한 설명입니다.

## 📁 프로젝트 구조

```
src/
├── app/
│   └── posts/
│       ├── page.tsx              # 포스트 목록 페이지
│       └── [slug]/
│           └── page.tsx          # 개별 포스트 페이지 (동적 라우팅)
├── domain/
│   └── post-detail/
│       └── components/
│           ├── post-header.tsx   # 포스트 헤더 컴포넌트
│           └── paragraph-comments.tsx # 문단별 댓글 컴포넌트
└── shared/
    └── lib/
        └── mdx.ts               # MDX 파일 처리 유틸리티

content/
└── posts/
    └── *.mdx                    # MDX 포스트 파일들
```

## 🚀 주요 구현 사항

### 1. 동적 라우팅 시스템

**파일**: `src/app/posts/[slug]/page.tsx`

- Next.js App Router의 동적 라우팅을 활용
- URL 슬러그를 통해 개별 포스트에 접근 (`/posts/example-post`)
- `generateMetadata` 함수로 SEO 최적화된 메타데이터 생성

**주요 기능**:
- MDX 파일을 서버에서 불러와 렌더링
- 존재하지 않는 포스트는 404 페이지로 리다이렉트
- 커스텀 MDX 컴포넌트 적용

### 2. MDX 파일 처리 유틸리티

**파일**: `src/shared/lib/mdx.ts`

MDX 파일의 front matter와 컨텐츠를 파싱하는 유틸리티 함수들:

```typescript
// 개별 포스트 데이터 가져오기
getMDXContent(slug: string): Promise<PostData>

// 모든 포스트 슬러그 목록 가져오기
getAllPostSlugs(): string[]

// 모든 포스트 데이터 가져오기
getAllPosts(): PostData[]
```

**의존성**:
- `gray-matter`: Front matter 파싱
- `fs`, `path`: 파일 시스템 접근

### 3. 포스트 헤더 컴포넌트

**파일**: `src/domain/post-detail/components/post-header.tsx`

포스트의 메타데이터를 표시하는 컴포넌트:
- 제목, 설명, 작성일
- 카테고리 배지
- 태그 목록
- 한국어 날짜 포맷팅

### 4. 문단별 댓글 시스템

**파일**: `src/domain/post-detail/components/paragraph-comments.tsx`

각 문단마다 독립적인 댓글을 달 수 있는 시스템:

**주요 기능**:
- 문단별 고유 ID로 댓글 관리
- 로컬 스토리지를 활용한 댓글 저장
- 댓글 작성, 삭제 기능
- 토글 방식의 댓글 표시/숨김

**데이터 구조**:
```typescript
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}
```

### 5. 커스텀 MDX 컴포넌트

동적 페이지에서 정의된 커스텀 컴포넌트들:

- `p`: 문단 컴포넌트 (댓글 기능 포함)
- `h1`, `h2`, `h3`: 제목 컴포넌트들
- `code`: 인라인 코드 컴포넌트
- `pre`: 코드 블록 컴포넌트
- `blockquote`: 인용구 컴포넌트

각 컴포넌트는 Tailwind CSS로 스타일링되어 일관된 디자인을 제공합니다.

## 📝 MDX 파일 작성 규칙

MDX 파일은 다음과 같은 front matter 구조를 따라야 합니다:

```markdown
---
title: "포스트 제목"
date: "2025-01-26"
description: "포스트 설명"
category: "카테고리"
tags: ["태그1", "태그2"]
---

# 포스트 내용

이곳에 MDX 컨텐츠를 작성합니다.
```

## 🔧 기술 스택

- **Next.js 15**: React 프레임워크
- **next-mdx-remote-client**: MDX 원격 렌더링
- **gray-matter**: Front matter 파싱
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **React 19**: UI 라이브러리

## 🎯 사용 방법

1. **새 포스트 작성**:
   - `content/posts/` 디렉토리에 `새포스트.mdx` 파일 생성
   - Front matter와 MDX 컨텐츠 작성

2. **포스트 접근**:
   - `/posts/새포스트` URL로 접근

3. **댓글 사용**:
   - 각 문단 아래의 "댓글 보기" 버튼 클릭
   - 이름과 댓글 내용 입력 후 작성

## 🚀 향후 개선 사항

- 댓글 시스템의 서버 연동
- 검색 및 필터링 기능
- 댓글 수정 기능
- 답글 기능
- 좋아요/싫어요 기능
- 소셜 미디어 공유 기능

## 🔍 문제 해결

### 자주 발생하는 오류

1. **MDX 파일을 찾을 수 없음**:
   - `content/posts/` 디렉토리 존재 확인
   - 파일명과 URL 슬러그 일치 확인

2. **댓글이 저장되지 않음**:
   - 브라우저의 로컬 스토리지 설정 확인
   - 개발자 도구에서 Storage 탭 확인

3. **스타일이 적용되지 않음**:
   - Tailwind CSS 설정 확인
   - 클래스명 오타 확인