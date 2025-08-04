'use client';

import { useState, useEffect } from 'react';
import { TocItem } from '@/shared/lib/mdx';
import SectionHeader from '@/shared/ui/section-header';

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headings = toc.map((item) => document.getElementById(item.id)).filter(Boolean);

      let current = '';
      for (const heading of headings) {
        if (heading && heading.offsetTop <= window.scrollY + 100) {
          current = heading.id;
        }
      }

      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 80; // 80px 오프셋

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <>
      {/* 모바일 TOC 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-4 z-50 rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600 lg:hidden"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                    className={`toc-item ${activeId === item.id ? 'active' : ''} font-mono ${levelClass}`}
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

      {/* 모바일 TOC 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="bg-opacity-50 absolute inset-0 bg-black" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 bottom-0 left-0 rounded-t-lg p-4 shadow-lg"
            style={{ backgroundColor: 'var(--color-background)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: 'var(--color-foreground)' }}>
                목차
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{ color: 'var(--color-gray-foreground)' }}
                className="hover:opacity-80"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto">
              {toc.map((item, index) => {
                const isH1 = item.level === 1;
                const h1Index = toc.slice(0, index + 1).filter((tocItem) => tocItem.level === 1).length;
                const h1Number = h1Index.toString().padStart(2, '0');

                // 헤딩 레벨별 스타일 클래스
                const levelClasses = {
                  1: 'text-sm',
                  2: 'text-xs',
                  3: 'text-xs ',
                };
                const levelClass = levelClasses[item.level as keyof typeof levelClasses] || 'text-xs text-gray';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToHeading(item.id);
                      setIsOpen(false);
                    }}
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
      )}
    </>
  );
}
