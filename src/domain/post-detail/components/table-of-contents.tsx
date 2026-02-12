'use client';

import { useState, useEffect } from 'react';
import { TocItem } from '@/shared/lib/toc';
import SectionHeader from '@/shared/ui/section-header';

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headings = toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      let current = '';
      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      }

      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - 80;

      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <>
      {/* 모바일 TOC - 현재 헤딩 표시 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-line bg-background fixed right-4 bottom-4 left-4 z-50 flex items-center justify-between border px-4 py-3 lg:hidden"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-gray shrink-0 font-mono text-xs">TOC</span>
          <span className="text-foreground truncate text-sm">
            {activeId ? toc.find((item) => item.id === activeId)?.title || '목차' : '목차'}
          </span>
        </div>
        <svg
          className={`text-gray h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* 데스크톱 TOC */}
      <div className="hidden lg:block">
        <div className="sticky top-20 w-52">
          <div>
            <SectionHeader title="/ CONTENTS" />
            <nav className="custom-scrollbar max-h-96 space-y-1 overflow-y-auto">
              {toc.map((item, index) => {
                const isH1 = item.level === 1;
                const h1Index = toc.slice(0, index + 1).filter((tocItem) => tocItem.level === 1).length;
                const h1Number = h1Index.toString().padStart(2, '0');

                // 헤딩 레벨별 스타일 클래스
                const levelClasses = {
                  1: 'text-sm ',
                  2: 'text-xs ',
                  3: 'text-xs ',
                };
                const levelClass = levelClasses[item.level as keyof typeof levelClasses] || 'text-xs text-gray-light';

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`toc-item ${activeId === item.id ? 'active' : ''} ${levelClass}`}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {isH1 ? `${h1Number} ${item.title}` : item.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* 모바일 TOC 드롭다운 */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="border-line bg-background absolute right-4 bottom-16 left-4 border p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="custom-scrollbar max-h-64 space-y-1 overflow-y-auto">
              {toc.map((item, index) => {
                const isH1 = item.level === 1;
                const h1Index = toc.slice(0, index + 1).filter((tocItem) => tocItem.level === 1).length;
                const h1Number = h1Index.toString().padStart(2, '0');

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToHeading(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full py-1.5 text-left font-mono text-xs transition-colors ${
                      activeId === item.id ? 'text-foreground' : 'text-gray hover:text-foreground'
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {isH1 ? `${h1Number} ${item.title}` : item.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
