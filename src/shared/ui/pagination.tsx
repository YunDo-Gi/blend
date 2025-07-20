import { useSearchParams } from 'next/navigation';
import { createPageUrl, getVisiblePages } from '@/domain/post-list/utils/pagination-utils';
import { NavigationButton } from './navigation-button';
import { PageNumber } from './page-number';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  // URL 생성 함수 (searchParams가 바인딩된 버전)
  const createUrl = (page: number) => createPageUrl(page, searchParams);

  // 보여줄 페이지 번호들 계산
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-12 mb-8 flex items-center justify-center">
      <div className="flex items-center gap-2">
        {/* 이전 페이지 버튼 */}
        <NavigationButton
          href={currentPage > 1 ? createUrl(currentPage - 1) : undefined}
          direction="left"
          disabled={currentPage <= 1}
        />

        {/* 페이지 번호들 */}
        <div className="flex gap-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <div key={`dots-${index}`} className="text-gray px-3 py-2 font-mono text-sm">
                  ⋯
                </div>
              );
            }

            const pageNum = page as number;
            return <PageNumber key={pageNum} pageNum={pageNum} currentPage={currentPage} createPageUrl={createUrl} />;
          })}
        </div>

        {/* 다음 페이지 버튼 */}
        <NavigationButton
          href={currentPage < totalPages ? createUrl(currentPage + 1) : undefined}
          direction="right"
          disabled={currentPage >= totalPages}
        />
      </div>
    </div>
  );
}
