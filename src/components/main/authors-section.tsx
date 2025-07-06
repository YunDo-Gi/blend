'use client';

import { useState, useEffect } from 'react';
import InteractiveAvatar from '../icons/interactive-avatar';
import SectionHeader from '../ui/section-header';

interface Author {
  id: number;
  name: string;
  position: string;
  github: string;
}

const authors: Author[] = [
  {
    id: 1,
    name: 'YUNCHEOL KWAK',
    position: 'FRONT-END',
    github: 'https://github.com/YunDo-Gi',
  },
  {
    id: 2,
    name: 'MINSEOK KIM',
    position: 'BACK-END',
    github: 'https://github.com/rlaminseok0824',
  },
];

export default function AuthorsSection() {
  const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);
  const currentAuthor = authors[currentAuthorIndex];

  // 자동 전환 (5초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAuthorIndex((prevIndex) => (prevIndex + 1) % authors.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentAuthorIndex]); // currentAuthorIndex를 의존성 배열에 추가

  const handleDotClick = (index: number) => {
    setCurrentAuthorIndex(index);
    // useEffect가 currentAuthorIndex 변경을 감지하여 타이머가 자동으로 재시작됩니다
  };

  return (
    <>
      <SectionHeader title="/ AUTHORS">
        {/* Dot Indicators */}
        <div className="flex gap-2">
          {authors.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === currentAuthorIndex ? 'bg-foreground' : 'bg-line hover:bg-gray'
              }`}
              aria-label={`Switch to author ${index + 1}`}
            />
          ))}
        </div>
      </SectionHeader>

      {/* Avatar */}
      <div className="border-foreground mb-6 flex w-full items-center justify-center border p-2">
        <InteractiveAvatar className="max-h-full max-w-full" />
      </div>

      {/* Author Info */}
      <div className="text-foreground space-y-3 font-mono text-sm font-medium">
        <div className="border-foreground border-b border-dotted px-1 pb-2">
          <span>NAME : </span>
          <span>{currentAuthor.name}</span>
        </div>

        <div className="border-foreground border-b border-dotted px-1 pb-2">
          <span>POSITION : </span>
          <span className="bg-primary/75 p-1">{currentAuthor.position}</span>
          <span> DEVELOPER</span>
        </div>

        <div className="px-1">
          <a
            href={currentAuthor.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary/75 group flex items-center justify-between text-sm transition-colors"
          >
            <span>GITHUB</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </>
  );
}
