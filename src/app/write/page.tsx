'use client';

import PostWriteEditor from '@/domain/post-write/components/post-write-editor';
import { AuthGuard } from '@/domain/auth/components/auth-guard';

export default function WritePage() {
  return (
    <AuthGuard>
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8">
        <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--color-line)' }}>
          <p className="text-gray-foreground mb-2 font-mono text-sm">/ WRITE</p>
          <h1 className="text-foreground text-5xl font-semibold tracking-tight">Create Post</h1>
          <p className="text-gray-foreground mt-3 text-sm">메타 정보를 입력하고 마크다운으로 글을 작성하세요.</p>
        </header>

        <PostWriteEditor />
      </div>
    </AuthGuard>
  );
}
