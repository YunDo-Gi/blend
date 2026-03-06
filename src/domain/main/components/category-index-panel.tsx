'use client';

import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useCategories } from '@/shared/hooks/use-categories';

export default function CategoryIndexPanel() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div className="border-line bg-background text-foreground flex h-full min-h-[22rem] flex-col overflow-hidden border">
      <div className="border-line min-h-24 flex-1 border-b-2" />

      <div className="divide-line flex flex-col divide-y">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between px-3 py-2.5">
              <div className="bg-line h-3.5 w-20 animate-pulse" />
              <ArrowTopRightIcon aria-hidden="true" className="text-gray-foreground h-4 w-4" />
            </div>
          ))
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <Link
              key={category.id}
              href={`/posts?category=${category.id}`}
              className="group hover:bg-gray-2/40 flex items-center justify-between px-3 py-2.5 transition-colors"
            >
              <span className="group-hover:text-primary truncate font-serif text-[1.05rem] leading-none tracking-[-0.03em] lowercase transition-colors">
                {category.name}
              </span>
              <ArrowTopRightIcon
                aria-hidden="true"
                className="text-gray-foreground group-hover:text-primary h-4 w-4 transition-colors"
              />
            </Link>
          ))
        ) : (
          <Link
            href="/posts"
            className="group hover:bg-gray-2/40 flex items-center justify-between px-3 py-2.5 transition-colors"
          >
            <span className="group-hover:text-primary truncate font-serif text-[1.05rem] leading-none tracking-[-0.03em] lowercase transition-colors">
              all posts
            </span>
            <ArrowTopRightIcon
              aria-hidden="true"
              className="text-gray-foreground group-hover:text-primary h-4 w-4 transition-colors"
            />
          </Link>
        )}
      </div>

      <div className="border-line min-h-20 flex-1 border-t-2" />
    </div>
  );
}
