'use client';

import { useSearchParams } from 'next/navigation';
import SectionHeader from '../../../shared/ui/section-header';

interface CategoryItem {
  name: string;
  value: string;
}

interface CategorySidebarProps {
  onCategoryChangeAction: (category: string) => void;
}

const categories: CategoryItem[] = [
  { name: 'All', value: 'all' },
  { name: 'Frontend', value: 'frontend' },
  { name: 'Backend', value: 'backend' },
  { name: 'Blog Dev Log', value: 'blog' },
];

export default function CategorySidebar({ onCategoryChangeAction }: CategorySidebarProps) {
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') || 'all';

  const handleCategoryClick = (categoryValue: string) => {
    onCategoryChangeAction(categoryValue);
  };

  return (
    <div className="w-56 p-4">
      <SectionHeader title="/ CATEGORY" />

      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li key={index}>
            <button
              onClick={() => handleCategoryClick(category.value)}
              className={`flex w-full cursor-pointer items-center gap-3 text-left transition-colors ${
                activeCategory === category.value ? 'text-foreground' : 'hover:text-foreground text-gray'
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  activeCategory === category.value ? 'bg-foreground' : 'border-gray border-2'
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
