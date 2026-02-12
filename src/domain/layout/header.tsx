'use client';

import Link from 'next/link';
import Logo from '@/shared/icons/logo';
import { UserMenu } from '@/domain/auth/components/user-menu';

export default function Header() {
  return (
    <header className="bg-background border-line sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 space-x-2">
          <Logo />
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
