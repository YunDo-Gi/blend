'use client';

import { useState, useEffect, useRef } from 'react';
import SectionHeader from '../../../shared/ui/section-header';

interface Post {
  date: string;
  title: string;
}

const DUMMY_POSTS: Post[] = [
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
  { date: '06.09', title: '리액트로 애니메이션 구현하는 공간입니다. 제목을 입력해주세요.' },
];

const CELL_WIDTH = 20; // w-5 = 20px
const CELL_GAP = 4; // gap-1 = 4px
const ROWS = 5;

const FLIP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?-+:*&'.split('');

const FlipCell = ({
  targetChar,
  shouldFlip,
  rowIndex,
  colIndex,
}: {
  targetChar: string;
  shouldFlip: boolean;
  rowIndex: number;
  colIndex: number;
}) => {
  const [currentChar, setCurrentChar] = useState(targetChar);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (shouldFlip) {
      const delay = rowIndex * 100 + colIndex * 20;

      flipTimeoutRef.current = setTimeout(() => {
        const flipCount = Math.floor(Math.random() * 10) + 5;
        let currentFlip = 0;

        const flipInterval = setInterval(() => {
          if (currentFlip < flipCount) {
            const randomChar = FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)];
            setCurrentChar(randomChar);
            currentFlip++;
          } else {
            setCurrentChar(targetChar);
            clearInterval(flipInterval);
          }
        }, 80);
      }, delay);
    }

    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
    };
  }, [targetChar, shouldFlip, rowIndex, colIndex]);

  return (
    <div className="bg-gray-2 relative h-8 overflow-hidden inset-shadow-sm">
      <div className="bg-background absolute top-1/2 right-0 left-0 z-10 h-px -translate-y-0.5" />

      <div className="flex h-full w-full items-center justify-center font-mono text-sm font-semibold">
        {currentChar}
      </div>
    </div>
  );
};

export default function FlipBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(40);
  const [gridData, setGridData] = useState<string[][]>([]);
  const [shouldFlip, setShouldFlip] = useState(false);

  // 컨테이너 크기에 맞게 컬럼 수 계산
  useEffect(() => {
    const updateCols = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      // hidden 상태면 무시 (width가 0)
      if (containerWidth === 0) return;
      // 패딩 16px * 2 = 32px 제외
      const availableWidth = containerWidth - 32;
      const newCols = Math.floor((availableWidth + CELL_GAP) / (CELL_WIDTH + CELL_GAP));
      setCols(Math.max(20, Math.min(50, newCols))); // 최소 20, 최대 50컬럼
    };

    // 초기 계산 + hidden에서 표시될 때를 위한 지연 실행
    updateCols();
    const timer = setTimeout(updateCols, 100);

    const resizeObserver = new ResizeObserver(updateCols);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateCols);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCols);
    };
  }, []);

  // 데이터 생성 (cols 변경 시)
  useEffect(() => {
    const posts = DUMMY_POSTS.slice(0, ROWS);

    const postRows = posts.map((post) => {
      const maxTitleLength = cols - 8; // 날짜(6) + 공백(1) 제외
      const truncatedTitle =
        post.title.length > maxTitleLength ? post.title.slice(0, maxTitleLength - 3) + '...' : post.title;

      const fullText = `${post.date} ${truncatedTitle}`;
      return fullText.padEnd(cols, ' ').split('').slice(0, cols);
    });

    setGridData(postRows);
  }, [cols]);

  // 초기 플립 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFlip(true);
      setTimeout(() => {
        setShouldFlip(false);
      }, 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const updateBoard = () => {
    if (shouldFlip) return;

    setShouldFlip(true);

    setTimeout(() => {
      setShouldFlip(false);
    }, 3000);
  };

  return (
    <>
      <SectionHeader title="POSTS">
        <button
          onClick={updateBoard}
          className={`font-mono text-sm transition-colors ${
            shouldFlip ? 'text-gray cursor-not-allowed' : 'text-foreground hover:text-primary'
          }`}
          disabled={shouldFlip}
        >
          [update]
        </button>
      </SectionHeader>
      <div ref={containerRef} className="border-line/80 border p-4">
        <div className="mb-2 flex font-mono" style={{ gap: CELL_GAP }}>
          <div style={{ width: CELL_WIDTH * 6 + CELL_GAP * 5 }}>TIME</div>
          <div>TITLE</div>
        </div>

        <div className="flex flex-col" style={{ gap: CELL_GAP }}>
          {Array.from({ length: ROWS }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex" style={{ gap: CELL_GAP }}>
              {Array.from({ length: cols }).map((_, colIndex) => {
                const char = gridData[rowIndex]?.[colIndex] || ' ';
                return (
                  <div key={`${rowIndex}-${colIndex}`} style={{ width: CELL_WIDTH }} className="shrink-0">
                    <FlipCell targetChar={char} shouldFlip={shouldFlip} rowIndex={rowIndex} colIndex={colIndex} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
