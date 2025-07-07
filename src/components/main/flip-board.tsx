'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '../ui/section-header';

interface Post {
  date: string;
  title: string;
}

// 더미 데이터
const DUMMY_POSTS: Post[] = [
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
];

const GRID_CONFIG = {
  cols: 40,
  rows: 5, // 헤더 제외하고 포스트 5개만
};

// 단순 셀 컴포넌트
const FlipCell = ({ char }: { char: string }) => {
  return (
    <div className="bg-line relative h-8 overflow-hidden inset-shadow-sm">
      {/* 가운데 가로줄 */}
      <div className="bg-background absolute top-1/2 right-0 left-0 z-10 h-px -translate-y-0.5" />

      {/* 셀 내용 */}
      <div className={`flex h-full w-full items-center justify-center font-mono text-sm font-semibold`}>{char}</div>
    </div>
  );
};

export default function FlipBoard() {
  const [gridData, setGridData] = useState<string[][]>(
    // 초기값: 빈 공간으로 채운 고정 크기 배열 (헤더 제외)
    Array.from({ length: GRID_CONFIG.rows }, () => Array.from({ length: GRID_CONFIG.cols }, () => ' ')),
  );

  // 그리드 데이터 생성
  useEffect(() => {
    const posts = DUMMY_POSTS.slice(0, 5);

    // 포스트 행들 생성 (헤더 제외)
    const postRows = posts.map((post) => {
      const maxTitleLength = 32;
      const truncatedTitle =
        post.title.length > maxTitleLength ? post.title.slice(0, maxTitleLength) + '...' : post.title;

      const fullText = `${post.date} ${truncatedTitle}`;
      return fullText.padEnd(GRID_CONFIG.cols, ' ').split('').slice(0, GRID_CONFIG.cols);
    });

    setGridData(postRows);
  }, []);

  return (
    <>
      <SectionHeader title="/ POSTS" />
      <div className="border-foreground border p-4">
        {/* 헤더 텍스트 - 같은 그리드 구조로 정렬 */}
        <div className="mb-2 grid grid-cols-[repeat(40,1fr)] gap-1 font-mono">
          <div className="col-span-7">TIME</div>
          <div className="col-span-33">TITLE</div>
        </div>

        {/* 라인별 레이아웃 - 각 라인 사이 간격 */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: GRID_CONFIG.rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-[repeat(40,1fr)] gap-1">
              {Array.from({ length: GRID_CONFIG.cols }).map((_, colIndex) => {
                const char = gridData[rowIndex]?.[colIndex] || ' ';
                return <FlipCell key={`${rowIndex}-${colIndex}`} char={char} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
