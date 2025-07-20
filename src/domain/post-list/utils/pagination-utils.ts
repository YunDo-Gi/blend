import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * 페이지 번호에 따른 URL을 생성합니다
 */
export function createPageUrl(page: number, searchParams: ReadonlyURLSearchParams): string {
  const params = new URLSearchParams(searchParams.toString());
  
  if (page === 1) {
    params.delete('page');
  } else {
    params.set('page', page.toString());
  }
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * 페이지네이션에서 보여줄 페이지 번호들을 계산합니다
 */
export function getVisiblePages(currentPage: number, totalPages: number, delta: number = 2): (number | string)[] {
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];

  // 현재 페이지 주변의 페이지들 계산
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i);
  }

  // 첫 페이지와 생략 표시 추가
  if (currentPage - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  // 중간 범위 추가
  rangeWithDots.push(...range);

  // 마지막 페이지와 생략 표시 추가
  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages);
  } else {
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }
  }

  return rangeWithDots;
}
