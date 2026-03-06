'use client';

import { useSearchParams } from 'next/navigation';
import SectionHeader from '@/shared/ui/section-header';
import { useCategories } from '@/shared/hooks/use-categories';

interface CategorySidebarProps {
  onCategoryChangeAction: (category: string) => void;
  mobile?: boolean;
  hideHeader?: boolean;
  variant?: 'list' | 'chips';
}

export default function CategorySidebar({
  onCategoryChangeAction,
  mobile = false,
  hideHeader = false,
  variant = 'list',
}: CategorySidebarProps) {
  const searchParams = useSearchParams();
  const { data: categories = [], isLoading } = useCategories();

  const activeCategory = searchParams.get('category') || 'all';

  const handleCategoryClick = (categoryValue: string) => {
    onCategoryChangeAction(categoryValue);
  };

  if (mobile || variant === 'chips') {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-2">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`border-line shrink-0 border px-3 py-1.5 font-mono text-sm transition-colors ${
            activeCategory === 'all' ? 'bg-foreground text-background' : 'text-gray hover:text-foreground'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
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
      {!hideHeader && <SectionHeader title="CATEGORY" />}

      {isLoading ? (
        <p className="text-gray text-sm">Loading...</p>
      ) : (
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => handleCategoryClick('all')}
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
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.id)}
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
      )}
    </div>
  );
}
