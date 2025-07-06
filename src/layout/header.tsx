'use client';

import Link from 'next/link';
import Logo from '@/components/icons/logo';

export default function Header() {
  return (
    <header className="bg-background border-line sticky top-0 border-b transition-colors duration-(--animation-duration-toggle-theme) ease-(--easing-toggle-theme)">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2 space-x-2">
          <Logo />
        </Link>
      </div>
    </header>
  );
}
