interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2; // 현재 페이지 앞뒤로 보여줄 페이지 수
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 mb-8 flex items-center justify-center">
      <div className="flex items-center gap-2">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 font-mono text-sm transition-all duration-200 ${
            currentPage === 1 ? 'text-gray' : 'text-foreground hover:text-primary'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M10 12l-4-4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 페이지 번호들 */}
        <div className="flex gap-1">
          {getVisiblePages().map((page, index) => {
            if (page === '...') {
              return (
                <div key={`dots-${index}`} className="text-gray px-3 py-2 font-mono text-sm">
                  ⋯
                </div>
              );
            }

            const pageNum = page as number;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[40px] px-3 py-2 font-mono text-sm transition-all duration-200 ${
                  currentPage === pageNum
                    ? 'text-foreground hover:text-primary font-bold'
                    : 'text-gray hover:text-primary'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 font-mono text-sm transition-all duration-200 ${
            currentPage === totalPages ? 'text-gray' : 'text-foreground hover:text-primary'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
