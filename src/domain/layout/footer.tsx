'use client';

import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HIDDEN_PATHS = ['/write', '/settings'];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (HIDDEN_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <footer className="border-line bg-background border-t">
      <div className="lg:border-line mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="font-serif text-[1.05rem] leading-[1.1] tracking-[-0.03em] md:text-[1.2rem]">
              Blend archives notes, drafts, and unfinished thoughts.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <span className="text-gray-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
              &copy; {currentYear}
            </span>
            <Link
              href="/posts"
              className="group hover:text-primary inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors md:text-xs"
            >
              <span>All Posts</span>
              <ArrowRightIcon
                aria-hidden="true"
                className="text-foreground/60 group-hover:text-primary h-4 w-4 transition-colors"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
