import Link from 'next/link';

interface PageNumberProps {
  pageNum: number;
  currentPage: number;
  createPageUrl: (page: number) => string;
}

const baseClasses = 'block min-w-[40px] px-3 py-2 text-center font-mono text-sm transition-all duration-200';
const activeClasses = 'text-foreground hover:text-primary font-bold';
const inactiveClasses = 'text-gray hover:text-primary';

export function PageNumber({ pageNum, currentPage, createPageUrl }: PageNumberProps) {
  const isActive = currentPage === pageNum;
  const className = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

  return (
    <Link href={createPageUrl(pageNum)} className={className}>
      {pageNum}
    </Link>
  );
}
