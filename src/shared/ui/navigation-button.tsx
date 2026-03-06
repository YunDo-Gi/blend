import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

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
  const icon = direction === 'left' ? <ArrowLeftIcon className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />;

  if (disabled || !href) {
    return <span className={className}>{icon}</span>;
  }

  return (
    <Link href={href} className={className}>
      {icon}
    </Link>
  );
}
