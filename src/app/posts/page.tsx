'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/page-header';
import PostFilters from '@/components/post/post-filters';
import PostList, { totalPostsCount } from '@/components/post/post-list';
import CategorySidebar from '@/components/post/category-sidebar';

export default function PostPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="bg-background mx-auto min-h-screen max-w-7xl">
      <PageHeader count={totalPostsCount} />

      <div className="flex">
        <CategorySidebar onCategoryChange={handleCategoryChange} />

        <div className="flex-1">
          <div className="p-4">
            <PostFilters />
            <PostList selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}
