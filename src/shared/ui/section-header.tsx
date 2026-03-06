import { SlashIcon } from '@radix-ui/react-icons';

interface SectionHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function SectionHeader({ title, children }: SectionHeaderProps) {
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-foreground inline-flex items-center gap-1.5 font-serif text-sm font-normal tracking-wide">
          <SlashIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
          <span>{title}</span>
        </h2>
        {children && <div>{children}</div>}
      </div>

      <div className="border-foreground/50 mb-6 border-b"></div>
    </div>
  );
}
