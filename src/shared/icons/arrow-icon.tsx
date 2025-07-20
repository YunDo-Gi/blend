interface ArrowIconProps {
  direction: 'left' | 'right';
  className?: string;
}

export function ArrowIcon({ direction, className = '' }: ArrowIconProps) {
  const path = direction === 'left' ? 'M10 12l-4-4 4-4' : 'M6 4l4 4-4 4';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d={path} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
