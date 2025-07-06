interface SectionHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function SectionHeader({ title, children }: SectionHeaderProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-mono text-sm font-normal tracking-wide">{title}</h2>
        {children && <div>{children}</div>}
      </div>

      {/* Divider */}
      <div className="border-foreground mb-6 border-b"></div>
    </div>
  );
}
