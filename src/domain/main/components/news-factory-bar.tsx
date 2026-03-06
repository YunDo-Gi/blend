'use client';

import { useState } from 'react';
import Link from 'next/link';
import PostSearchForm from '@/shared/ui/post-search-form';
import PostSearchSpotlight from '@/shared/ui/post-search-spotlight';

export default function NewsFactoryBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:min-h-12 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="border-line flex min-w-0 items-stretch md:border-r">
            <PostSearchForm variant="compact-trigger" onTriggerAction={() => setIsSearchOpen(true)} />
          </div>

          <div className="border-line flex items-center justify-center border-t px-4 py-6 text-center font-serif text-3xl leading-none tracking-[0.04em] uppercase md:border-t-0 md:px-8 md:text-[2.35rem]">
            BLEND, MIX THOUGHTS
          </div>

          <div className="border-line flex items-center justify-end border-t px-4 py-3 md:h-full md:border-t-0 md:border-l md:px-6">
            <Link
              href="/posts"
              aria-label="Go to the post index"
              className="group text-muted-foreground hover:text-primary inline-flex shrink-0 items-center gap-1.5 font-mono text-xs font-medium tracking-[0.18em] uppercase transition-colors md:text-[13px]"
            >
              <span>All Posts</span>
              <span aria-hidden="true" className="text-foreground/60 group-hover:text-primary transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <PostSearchSpotlight isOpen={isSearchOpen} onCloseAction={() => setIsSearchOpen(false)} />
    </>
  );
}
