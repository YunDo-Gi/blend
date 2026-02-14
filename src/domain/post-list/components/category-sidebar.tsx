'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SectionHeader from '../../../shared/ui/section-header';
import { categoryApi } from '@/shared/api';
import { Category } from '@/shared/types/api';

interface CategorySidebarProps {
  onCategoryChangeAction: (category: string) => void;
}

export default function CategorySidebar({ onCategoryChangeAction }: CategorySidebarProps) {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    onCategoryChangeAction(categoryValue);
  };

  return (
    <div className="w-56 p-4">
      <SectionHeader title="/ CATEGORY" />

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
