'use client';

import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/shared/ui/section-header';
import { formatDate } from '@/shared/lib/date';
import { useRecentPost } from '@/domain/main/hooks/use-recent-post';

function RecentSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-(--layout-grid-padding) lg:flex-row lg:gap-8">
      <div className="bg-gray-2/35 aspect-image w-full shrink-0 animate-pulse lg:w-72" />
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="bg-gray-2/35 h-7 w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="bg-gray-2/25 h-3 w-full animate-pulse" />
          <div className="bg-gray-2/25 h-3 w-5/6 animate-pulse" />
          <div className="bg-gray-2/25 h-3 w-2/3 animate-pulse" />
        </div>
        <div className="bg-gray-2/25 h-3 w-40 animate-pulse" />
      </div>
    </div>
  );
}

function RecentSectionEmpty() {
  return (
    <div className="text-gray-foreground pb-(--layout-grid-padding) font-mono text-xs tracking-[0.08em] uppercase">
      No published posts yet.
    </div>
  );
}

export default function RecentSection() {
  const { recentPost, thumbnailUrl, excerpt, isLoading, isEmpty } = useRecentPost();

  return (
    <>
      <SectionHeader title="RECENT" />

      {isLoading ? (
        <RecentSectionSkeleton />
      ) : isEmpty || !recentPost ? (
        <RecentSectionEmpty />
      ) : (
        <Link
          href={`/posts/${recentPost.id}`}
          className="group flex cursor-pointer flex-col gap-4 pb-(--layout-grid-padding) lg:flex-row lg:gap-6"
        >
          <div className="border-line/80 aspect-image group-hover:border-primary/80 relative w-full shrink-0 overflow-hidden border transition-colors lg:w-72">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={recentPost.title}
                fill
                sizes="(min-width: 1024px) 18rem, 100vw"
                unoptimized
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-1 flex-col content-between justify-between gap-3 lg:gap-0">
            <div>
              <h3 className="group-hover:text-primary mb-2 text-2xl leading-relaxed font-medium transition-colors">
                {recentPost.title}
              </h3>

              <p className="text-gray-foreground text-xs leading-relaxed">{excerpt}</p>
            </div>

            <div className="text-gray-foreground flex items-center gap-2 font-mono text-xs">
              <span>{formatDate(recentPost.created_at)}</span>
              {recentPost.author ? (
                <>
                  <span>•</span>
                  <span>{recentPost.author}</span>
                </>
              ) : null}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
