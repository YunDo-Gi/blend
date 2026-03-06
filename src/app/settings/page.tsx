'use client';

import { AuthGuard } from '@/domain/auth/components/auth-guard';
import { CategoryManager } from '@/domain/settings/components/category-manager';
import SectionHeader from '@/shared/ui/section-header';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-8">
        <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--color-line)' }}>
          <p className="text-gray-foreground mb-2 font-mono text-sm">/ SETTINGS</p>
          <h1 className="text-foreground text-5xl font-semibold tracking-tight">Settings</h1>
          <p className="text-gray-foreground mt-3 text-sm">블로그 설정을 관리합니다.</p>
        </header>

        <section>
          <SectionHeader title="CATEGORIES" />
          <CategoryManager />
        </section>
      </div>
    </AuthGuard>
  );
}
