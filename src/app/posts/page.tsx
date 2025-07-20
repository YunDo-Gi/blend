'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import PageHeader from '@/shared/ui/page-header';
import PostFilters from '@/domain/post-list/components/post-filters';
import CategorySidebar from '@/domain/post-list/components/category-sidebar';
import PostList, { totalPostsCount } from '@/domain/post-list/components/post-list';
export default function PostPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
      <PageHeader count={totalPostsCount} />

      <div className="flex">
        <CategorySidebar onCategoryChangeAction={handleCategoryChange} />

        <div className="flex-1">
          <div className="p-4">
            <PostFilters />
            <PostList />
          </div>
        </div>
      </div>
    </div>
  );
}
