'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import PageHeader from '@/shared/ui/page-header';
import PostFilters from '@/domain/post-list/components/post-filters';
import CategorySidebar from '@/domain/post-list/components/category-sidebar';
import PostList from '@/domain/post-list/components/post-list';

function PostPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    params.delete('page');

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-background mx-auto min-h-screen max-w-7xl">
      <PageHeader count={totalCount} />

      <div className="flex">
        {/* 데스크톱 사이드바 */}
        <div className="hidden lg:block">
          <CategorySidebar onCategoryChangeAction={handleCategoryChange} />
        </div>

        <div className="flex-1">
          <div className="p-4">
            {/* 모바일 카테고리 */}
            <div className="mb-4 lg:hidden">
              <CategorySidebar onCategoryChangeAction={handleCategoryChange} mobile />
            </div>

            <PostFilters />
            <PostList onTotalCountChange={setTotalCount} />
          </div>
        </div>
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
