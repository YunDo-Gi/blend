'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import PostSearchSpotlight from '@/shared/ui/post-search-spotlight';
import CategorySidebar from '@/domain/post-list/components/category-sidebar';
import PostFilters from '@/domain/post-list/components/post-filters';
import PostList from '@/domain/post-list/components/post-list';

function PostPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || '';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    params.delete('page');

    const nextQuery = params.toString();
    router.push(nextQuery ? `?${nextQuery}` : '/posts');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (isSearchShortcut) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-background mx-auto min-h-screen max-w-7xl">
      <div className="my-4 p-4 sm:my-6 lg:my-8">
        <div className="flex flex-col gap-1">
          <button type="button" onClick={() => setIsSearchOpen((prev) => !prev)} className="group text-left">
            <span className="flex items-start">
              <span className="group-hover:text-primary font-serif text-[clamp(3.5rem,10vw,6.5rem)] leading-none font-medium transition-colors duration-300">
                Post
              </span>
              <span className="text-foreground text-primary pt-1 font-mono text-sm font-bold sm:text-base md:text-lg xl:text-xl">
                ({totalCount})
              </span>
            </span>
          </button>
          <div className="text-gray-foreground font-mono text-[10px] tracking-[0.08em] uppercase">
            Click the title or press Ctrl/Cmd + K
          </div>
        </div>
      </div>

      <PostSearchSpotlight
        isOpen={isSearchOpen}
        onCloseAction={() => setIsSearchOpen(false)}
        initialQuery={currentQuery}
        category={currentCategory || undefined}
      />

      <div className="p-4">
        <div className="mb-2 sm:mb-4 lg:mb-6">
          <CategorySidebar onCategoryChangeAction={handleCategoryChange} variant="chips" />
        </div>

        <PostFilters />
        <PostList onTotalCountChange={setTotalCount} />
      </div>
    </div>
  );
}

export default function PostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostPageContent />
    </Suspense>
  );
}
