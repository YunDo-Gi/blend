'use client';

import { useEffect } from 'react';
import PostSearchForm from './post-search-form';

interface PostSearchSpotlightProps {
  isOpen: boolean;
  onCloseAction: () => void;
  initialQuery?: string;
  category?: string;
}

export default function PostSearchSpotlight({
  isOpen,
  onCloseAction,
  initialQuery = '',
  category,
}: PostSearchSpotlightProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCloseAction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/55 px-4 backdrop-blur-sm" onClick={onCloseAction} role="presentation">
      <div className="mx-auto flex min-h-full max-w-7xl items-start justify-center pt-24 md:pt-32">
        <div className="w-full max-w-3xl" onClick={(event) => event.stopPropagation()} role="presentation">
          <PostSearchForm
            variant="spotlight"
            initialQuery={initialQuery}
            category={category}
            autoFocus
            onSubmitAction={onCloseAction}
          />
          <div className="text-gray-foreground mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.08em] uppercase">
            <span>Search by title</span>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
