'use client';

import { type FormEvent, useEffect, useId, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface PostSearchFormProps {
  initialQuery?: string;
  category?: string;
  variant?: 'compact' | 'compact-trigger' | 'full' | 'toolbar' | 'spotlight';
  autoFocus?: boolean;
  onSubmitAction?: () => void;
  onTriggerAction?: () => void;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PostSearchForm({
  initialQuery = '',
  category,
  variant = 'full',
  autoFocus = false,
  onSubmitAction,
  onTriggerAction,
}: PostSearchFormProps) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    }

    if (category) {
      params.set('category', category);
    }

    const targetUrl = params.toString() ? `/posts?${params.toString()}` : '/posts';

    onSubmitAction?.();

    startTransition(() => {
      router.push(targetUrl);
    });
  };

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-4 py-3 md:min-h-16 md:px-5"
      >
        <label htmlFor={inputId} className="sr-only">
          Search posts by title
        </label>
        <button
          type="submit"
          className="text-gray-foreground hover:text-foreground flex shrink-0 items-center transition-colors"
          aria-label="Search posts"
        >
          <SearchIcon className="h-4 w-4 md:h-[1.125rem] md:w-[1.125rem]" />
        </button>
        <input
          id={inputId}
          type="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search post titles"
          autoComplete="off"
          spellCheck={false}
          className="text-gray-foreground placeholder:text-gray-foreground/80 min-w-0 flex-1 bg-transparent font-mono text-[11px] tracking-[0.02em] outline-none md:text-xs"
        />
      </form>
    );
  }

  if (variant === 'compact-trigger') {
    return (
      <button
        type="button"
        onClick={onTriggerAction}
        className="flex w-full min-w-0 flex-1 cursor-text items-center gap-3 px-4 py-3 text-left md:h-full md:px-5"
        aria-label="Open post search"
        aria-haspopup="dialog"
      >
        <SearchIcon className="text-gray-foreground h-[1.125rem] w-[1.125rem] md:h-5 md:w-5" />
        <span className="text-gray-foreground/80 min-w-0 flex-1 truncate font-mono text-xs tracking-[0.18em] md:text-[13px]">
          SEARCH POSTS
        </span>
      </button>
    );
  }

  if (variant === 'toolbar') {
    return (
      <form
        onSubmit={handleSubmit}
        className="border-line flex min-w-0 items-center gap-3 border px-3 py-2.5 md:min-w-80 md:px-4"
      >
        <label htmlFor={inputId} className="sr-only">
          Search posts by title
        </label>
        <button
          type="submit"
          className="text-gray-foreground hover:text-foreground flex shrink-0 items-center transition-colors"
          aria-label="Search posts"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
        <input
          id={inputId}
          type="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles"
          autoComplete="off"
          spellCheck={false}
          className="text-foreground placeholder:text-gray min-w-0 flex-1 bg-transparent font-mono text-xs tracking-[0.04em] outline-none"
        />
      </form>
    );
  }

  if (variant === 'spotlight') {
    return (
      <div className="border-line bg-background/80 relative overflow-hidden border">
        <div className="pointer-events-none absolute inset-0" />

        <div className="border-line text-gray-foreground relative flex items-center justify-between border-b px-5 py-3 font-mono text-[10px] tracking-[0.1em] uppercase">
          <span>/ SPOTLIGHT SEARCH</span>
          <span>{category ? 'CATEGORY FILTER ON' : 'ALL POSTS'}</span>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center gap-4 px-5 py-5 md:px-6 md:py-6">
          <button
            type="submit"
            className="text-gray-foreground hover:text-foreground flex shrink-0 items-center transition-colors"
            aria-label="Search posts"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <label htmlFor={inputId} className="sr-only">
            Search posts by title
          </label>
          <input
            id={inputId}
            type="search"
            autoFocus={autoFocus}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a post title"
            autoComplete="off"
            spellCheck={false}
            className="text-foreground placeholder:text-gray min-w-0 flex-1 bg-transparent text-2xl font-medium outline-none md:text-3xl"
          />
          <div className="text-gray-foreground hidden font-mono text-[10px] tracking-[0.08em] uppercase md:block">
            Press Enter
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="border-line mb-6 border">
      <div className="border-line text-gray-foreground flex items-center justify-between border-b px-4 py-2 font-mono text-[10px] tracking-[0.08em] uppercase">
        <span>/ SEARCH TITLE</span>
        <span>{category ? 'CATEGORY FILTER ON' : 'ALL POSTS'}</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center">
        <label htmlFor={inputId} className="sr-only">
          Search posts by title
        </label>
        <div className="border-line flex min-w-0 flex-1 items-center gap-3 border px-3 py-3">
          <SearchIcon className="text-gray-foreground h-4 w-4 shrink-0" />
          <input
            id={inputId}
            type="search"
            autoFocus={autoFocus}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts by title"
            autoComplete="off"
            spellCheck={false}
            className="text-foreground placeholder:text-gray min-w-0 flex-1 bg-transparent font-mono text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          className="text-foreground border-foreground hover:bg-primary/75 shrink-0 border border-dotted px-4 py-3 font-mono text-xs font-medium transition-colors md:px-5"
        >
          {isPending ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </form>
    </div>
  );
}
