'use client';

const STORAGE_KEY = 'blend.reading-progress.v1';
export const READING_PROGRESS_EVENT = 'blend:reading-progress-updated';
const EMPTY_ENTRIES: ReadingProgressEntry[] = [];

let cachedRaw: string | null | undefined;
let cachedEntries: ReadingProgressEntry[] = EMPTY_ENTRIES;

export interface ReadingProgressEntry {
  postId: string;
  title: string;
  author?: string;
  category?: string;
  thumbnail?: string;
  lastBlockId: string;
  progress: number;
  updatedAt: string;
}

function canUseStorage() {
  return typeof window !== 'undefined';
}

function sortEntries(entries: ReadingProgressEntry[]) {
  return [...entries].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function emitReadingProgressEvent() {
  if (!canUseStorage()) return;
  window.dispatchEvent(new CustomEvent(READING_PROGRESS_EVENT));
}

export function getReadingProgressEntries(): ReadingProgressEntry[] {
  if (!canUseStorage()) return EMPTY_ENTRIES;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedEntries;
    }

    if (!raw) {
      cachedRaw = raw;
      cachedEntries = EMPTY_ENTRIES;
      return cachedEntries;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cachedRaw = raw;
      cachedEntries = EMPTY_ENTRIES;
      return cachedEntries;
    }

    cachedRaw = raw;
    cachedEntries = sortEntries(
      parsed.filter((entry): entry is ReadingProgressEntry => {
        return typeof entry?.postId === 'string' && typeof entry?.lastBlockId === 'string';
      }),
    );
    return cachedEntries;
  } catch {
    cachedRaw = null;
    cachedEntries = EMPTY_ENTRIES;
    return cachedEntries;
  }
}

export function getReadingProgress(postId: string) {
  return getReadingProgressEntries().find((entry) => entry.postId === postId) ?? null;
}

export function saveReadingProgress(entry: ReadingProgressEntry) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry]));
  emitReadingProgressEvent();
}

export function removeReadingProgress(postId: string) {
  if (!canUseStorage()) return;

  const nextEntries = getReadingProgressEntries().filter((entry) => entry.postId !== postId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
  emitReadingProgressEvent();
}
