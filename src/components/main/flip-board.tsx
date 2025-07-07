'use client';

import { useState, useEffect, useRef } from 'react';
import SectionHeader from '../ui/section-header';

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

const GRID_CONFIG = {
  cols: 40,
  rows: 5,
};

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
    <div className="bg-gray-light relative h-8 overflow-hidden inset-shadow-sm">
      <div className="bg-background absolute top-1/2 right-0 left-0 z-10 h-px -translate-y-0.5" />

      <div className="flex h-full w-full items-center justify-center font-mono text-sm font-semibold">
        {currentChar}
      </div>
    </div>
  );
};

export default function FlipBoard() {
  const [gridData, setGridData] = useState<string[][]>(
    Array.from({ length: GRID_CONFIG.rows }, () => Array.from({ length: GRID_CONFIG.cols }, () => ' ')),
  );
  const [shouldFlip, setShouldFlip] = useState(false);

  useEffect(() => {
    const posts = DUMMY_POSTS.slice(0, 5);

    const postRows = posts.map((post) => {
      const maxTitleLength = 32;
      const truncatedTitle =
        post.title.length > maxTitleLength ? post.title.slice(0, maxTitleLength) + '...' : post.title;

      const fullText = `${post.date} ${truncatedTitle}`;
      return fullText.padEnd(GRID_CONFIG.cols, ' ').split('').slice(0, GRID_CONFIG.cols);
    });

    setGridData(postRows);

    setTimeout(() => {
      setShouldFlip(true);
      setTimeout(() => {
        setShouldFlip(false);
      }, 3000);
    }, 500);
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
      <SectionHeader title="/ POSTS">
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
      <div className="border-foreground border p-4">
        <div className="mb-2 grid grid-cols-[repeat(40,1fr)] gap-1 font-mono">
          <div className="col-span-6">TIME</div>
          <div className="col-span-34">TITLE</div>
        </div>

        <div className="flex flex-col gap-2">
          {Array.from({ length: GRID_CONFIG.rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-[repeat(40,1fr)] gap-1">
              {Array.from({ length: GRID_CONFIG.cols }).map((_, colIndex) => {
                const char = gridData[rowIndex]?.[colIndex] || ' ';
                return (
                  <FlipCell
                    key={`${rowIndex}-${colIndex}`}
                    targetChar={char}
                    shouldFlip={shouldFlip}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
