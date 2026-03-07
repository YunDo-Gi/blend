'use client';

import { useSyncExternalStore } from 'react';
import {
  getReadingProgressEntries,
  READING_PROGRESS_EVENT,
  type ReadingProgressEntry,
} from '@/shared/lib/reading-progress';

const EMPTY_ENTRIES: ReadingProgressEntry[] = [];

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(READING_PROGRESS_EVENT, handler as EventListener);

  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(READING_PROGRESS_EVENT, handler as EventListener);
  };
}

function getSnapshot(): ReadingProgressEntry[] {
  return getReadingProgressEntries();
}

function getServerSnapshot(): ReadingProgressEntry[] {
  return EMPTY_ENTRIES;
}

export function useReadingProgressEntries() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
