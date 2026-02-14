'use client';

import { useState } from 'react';
import PageHeader from '@/shared/ui/page-header';
import PostFilters from '@/domain/post-list/components/post-filters';
import PostItem from '@/domain/post-list/components/post-item';

const mockCategories = [
  { id: '1', name: 'Development' },
  { id: '2', name: 'Design' },
  { id: '3', name: 'DevOps' },
  { id: '4', name: 'AI/ML' },
];

const mockPosts = [
  {
    id: '1',
    title: 'React Fiber의 내부 구조와 렌더링 최적화 전략',
    date: 'FEB 05 2026',
    category: 'Development',
    author: 'IVAN BURAZIN',
  },
  {
    id: '2',
    title: 'Building Scalable React Applications with Next.js 15',
    date: 'FEB 03 2026',
    category: 'Development',
    author: 'JOHN DOE',
  },
  {
    id: '3',
    title: 'The Future of AI-Powered Development Tools',
    date: 'JAN 28 2026',
    category: 'AI/ML',
    author: 'JANE SMITH',
  },
  {
    id: '4',
    title: 'Modern CSS Techniques for Better User Interfaces',
    date: 'JAN 25 2026',
    category: 'Design',
    author: 'ALEX KIM',
  },
  {
    id: '5',
    title: 'Kubernetes Best Practices for Production Deployments',
    date: 'JAN 20 2026',
    category: 'DevOps',
    author: 'CHRIS LEE',
  },
  {
    id: '6',
    title: 'Understanding TypeScript Generic Types and Constraints',
    date: 'JAN 15 2026',
    category: 'Development',
    author: 'SAM PARK',
  },
];

function CategorySidebarMock({
  activeCategory,
  onCategoryChange,
  mobile = false,
}: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`border-line shrink-0 border px-3 py-1.5 font-mono text-sm transition-colors ${
            activeCategory === 'all' ? 'bg-foreground text-background' : 'text-gray hover:text-foreground'
          }`}
        >
          All
        </button>
        {mockCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`border-line shrink-0 border px-3 py-1.5 font-mono text-sm transition-colors ${
              activeCategory === category.id ? 'bg-foreground text-background' : 'text-gray hover:text-foreground'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-56 p-4">
      <div className="text-gray mb-4 font-mono text-xs tracking-wide">/ CATEGORY</div>
      <ul className="space-y-3">
        <li>
          <button
            onClick={() => onCategoryChange('all')}
            className={`flex w-full cursor-pointer items-center gap-3 text-left transition-colors ${
              activeCategory === 'all' ? 'text-foreground' : 'hover:text-foreground text-gray'
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                activeCategory === 'all' ? 'bg-foreground' : 'border-gray border-2'
              }`}
            />
            <span>All</span>
          </button>
        </li>
        {mockCategories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`flex w-full cursor-pointer items-center gap-3 text-left transition-colors ${
                activeCategory === category.id ? 'text-foreground' : 'hover:text-foreground text-gray'
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  activeCategory === category.id ? 'bg-foreground' : 'border-gray border-2'
                }`}
              />
              <span>{category.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PostTestPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts =
    activeCategory === 'all'
      ? mockPosts
      : mockPosts.filter((post) => post.category === mockCategories.find((c) => c.id === activeCategory)?.name);

  return (
    <div className="bg-background mx-auto min-h-screen max-w-7xl">
      <PageHeader count={filteredPosts.length} />

      <div className="flex">
        {/* 데스크톱 사이드바 */}
        <div className="hidden lg:block">
          <CategorySidebarMock activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>

        <div className="flex-1">
          <div className="p-4">
            {/* 모바일 카테고리 */}
            <div className="mb-4 lg:hidden">
              <CategorySidebarMock activeCategory={activeCategory} onCategoryChange={setActiveCategory} mobile />
            </div>

            <PostFilters />

            <div className="bg-background">
              {filteredPosts.map((post) => (
                <PostItem key={post.id} id={post.id} date={post.date} title={post.title} author={post.author} />
              ))}

              {filteredPosts.length === 0 && <div className="text-gray p-8 text-center">게시글이 없습니다.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
