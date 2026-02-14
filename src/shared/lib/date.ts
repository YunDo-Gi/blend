/**
 * 날짜를 YYYY.MM.DD 형식으로 포매팅
 * @param dateString - ISO 날짜 문자열 또는 Date 객체
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 임시저장 시간을 포매팅
 * @param timestamp - Unix timestamp (밀리초)
 */
export function formatSavedTime(timestamp: number | null): string {
  if (!timestamp) return 'Waiting to save';
  return `Saved at ${new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })}`;
}

/**
 * 댓글 등의 타임스탬프를 상대 시간으로 포매팅
 * @param dateString - ISO 날짜 문자열
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return formatDate(dateString);
}

/**
 * 타임스탬프를 한국어 형식으로 포매팅
 * @param dateString - ISO 날짜 문자열
 */
export function formatTimestamp(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
