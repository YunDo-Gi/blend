import Link from 'next/link';
import { ArrowIcon } from '../icons/arrow-icon';

interface NavigationButtonProps {
  href?: string;
  direction: 'left' | 'right';
  disabled?: boolean;
}

const baseClasses = 'px-3 py-2 font-mono text-sm transition-all duration-200';
const enabledClasses = 'text-foreground hover:text-primary';
const disabledClasses = 'text-gray';

export function NavigationButton({ href, direction, disabled = false }: NavigationButtonProps) {
  const className = `${baseClasses} ${disabled ? disabledClasses : enabledClasses}`;

  if (disabled || !href) {
    return (
      <span className={className}>
        <ArrowIcon direction={direction} />
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      <ArrowIcon direction={direction} />
    </Link>
  );
}
