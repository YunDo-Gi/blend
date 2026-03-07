'use client';

import Link from 'next/link';
import { useReadingProgressEntries } from '@/shared/hooks/use-reading-progress';
import { formatDate } from '@/shared/lib/date';
import type { ReadingProgressEntry } from '@/shared/lib/reading-progress';

const SLIP_LABEL_TEXT = 'text-xs text-gray-foreground';
const SLIP_VALUE_TEXT = 'text-sm leading-tight text-foreground';
const SLIP_BOTTOM_GRID = 'grid grid-cols-[3.8rem_minmax(0,1fr)_3.4rem]';

function SlipLabel({ label }: { label: string }) {
  return (
    <div aria-label={label} className={`mx-auto flex w-full max-w-[3.8rem] justify-between ${SLIP_LABEL_TEXT}`}>
      {Array.from(label).map((char, index) => (
        <span key={`${label}-${index}`} aria-hidden="true">
          {char}
        </span>
      ))}
    </div>
  );
}

function LoanField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line/60 grid grid-cols-[3.8rem_minmax(0,1fr)] border-b">
      <div className="border-line/60 border-r px-2 py-1.5">
        <SlipLabel label={label} />
      </div>
      <div className={`px-2 py-1.5 ${SLIP_VALUE_TEXT}`}>{value}</div>
    </div>
  );
}

function formatSlipDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function BlankSlipRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`border-line/60 ${SLIP_BOTTOM_GRID} border-t`}>
          <div className="border-line/60 border-r px-2 py-3" />
          <div className="border-line/60 border-r px-2 py-3" />
          <div className="px-2 py-3" />
        </div>
      ))}
    </>
  );
}

function ContinueReadingCard({ entry }: { entry: ReadingProgressEntry }) {
  const progress = Math.max(0, Math.min(100, Math.round(entry.progress)));
  const borrowerName = '독자 12호';

  return (
    <Link
      href={`/posts/${entry.postId}?resume=1`}
      aria-label={`${entry.title} 이어 읽기`}
      title={`${entry.title} (${progress}% read)`}
      className="mx-auto block w-full max-w-[15.5rem] transition-transform duration-300 ease-out hover:-translate-y-8"
    >
      <div className="text-foreground ring-line/35 bg-[#EFEBE6] ring-1 dark:bg-[#211E1C]">
        <div className="border-line/60 border-b px-2 pt-2 pb-1">
          <div className="text-gray-foreground mb-3 flex items-start justify-between gap-3 font-mono text-xs">
            <span>resume card</span>
            <span>{entry.lastBlockId.slice(0, 8)}</span>
          </div>
        </div>

        <LoanField label="저자명" value={entry.author || 'Unknown author'} />
        <LoanField label="서명" value={entry.title} />

        <div className={`border-line/60 mt-0.5 ${SLIP_BOTTOM_GRID} border-t`}>
          <div className="border-line/60 border-r">
            <div className="border-line/60 border-b px-2 py-1.5">
              <SlipLabel label="대출일자" />
            </div>
            <div className={`px-2 py-1.5 ${SLIP_VALUE_TEXT}`}>{formatSlipDate(entry.updatedAt)}</div>
          </div>
          <div className="border-line/60 border-r">
            <div className="border-line/60 border-b px-2 py-1.5">
              <SlipLabel label="대출자명" />
            </div>
            <div className={`px-2 py-1.5 ${SLIP_VALUE_TEXT}`}>{borrowerName}</div>
          </div>
          <div>
            <div className="border-line/60 border-b px-2 py-1.5">
              <SlipLabel label="진행도" />
            </div>
            <div className={`px-2 py-1.5 text-right ${SLIP_VALUE_TEXT}`}>{progress}%</div>
          </div>
        </div>

        <BlankSlipRows count={2} />
      </div>
    </Link>
  );
}

function EmptyContinueReadingCard() {
  return (
    <div className="mx-auto w-full max-w-[15.5rem]">
      <div className="text-foreground ring-line/35 bg-[#EFEBE6] ring-1 dark:bg-[#211E1C]">
        <div className="border-line/60 border-b px-2 pt-2 pb-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="bg-gray-2/65 h-2 w-16" />
            <div className="bg-gray-2/65 h-2 w-10" />
          </div>
        </div>

        <div className="border-line/60 grid grid-cols-[3.8rem_minmax(0,1fr)] border-b">
          <div className="border-line/60 border-r px-2 py-1.5">
            <SlipLabel label="저자명" />
          </div>
          <div className="px-2 py-1.5">
            <div className="bg-gray-2/65 h-3 w-20" />
          </div>
        </div>

        <div className="border-line/60 grid grid-cols-[3.8rem_minmax(0,1fr)] border-b">
          <div className="border-line/60 border-r px-2 py-1.5">
            <SlipLabel label="서명" />
          </div>
          <div className="space-y-1 px-2 py-1.5">
            <div className="bg-gray-2/55 h-3 w-5/6" />
          </div>
        </div>

        <div className={SLIP_BOTTOM_GRID}>
          <div className="border-line/60 border-r">
            <div className="border-line/60 border-b px-2 py-1.5">
              <SlipLabel label="대출일자" />
            </div>
            <div className="px-2 py-2">
              <div className="bg-gray-2/65 h-4 w-8" />
            </div>
          </div>
          <div className="border-line/60 border-r">
            <div className="border-line/60 border-b px-2 py-1.5">
              <SlipLabel label="대출자명" />
            </div>
            <div className="px-2 py-2">
              <div className="bg-gray-2/55 h-4 w-16" />
            </div>
          </div>
          <div>
            <div className="border-line/60 border-b px-2 py-1.5">
              <SlipLabel label="진행도" />
            </div>
            <div className="px-2 py-2">
              <div className="bg-gray-2/55 ml-auto h-4 w-10" />
            </div>
          </div>
        </div>

        <BlankSlipRows count={2} />
      </div>
    </div>
  );
}

export default function ContinueReadingSection() {
  const entry = useReadingProgressEntries()[0];

  return (
    <div className="flex items-end justify-center">
      {entry ? <ContinueReadingCard entry={entry} /> : <EmptyContinueReadingCard />}
    </div>
  );
}
