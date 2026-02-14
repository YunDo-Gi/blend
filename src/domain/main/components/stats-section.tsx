'use client';

import { useCategories } from '@/shared/hooks/use-categories';
import { usePosts } from '@/shared/hooks/use-posts';

export default function StatsSection() {
  const { data: postsData } = usePosts({ limit: 1 });
  const { data: categories } = useCategories();

  const stats = [
    { count: postsData?.pagination.total ?? 0, label: 'POSTS' },
    { count: categories?.length ?? 0, label: 'CATEGORIES' },
  ];

  return (
    <div className="border-line space-y-2 border-t py-(--layout-grid-padding)">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2 pl-(--layout-grid-padding)">
          <div className="bg-gray-foreground h-1 w-1 rounded-full"></div>
          <span className="text-gray-foreground font-mono text-xs font-medium">
            {stat.count} {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
