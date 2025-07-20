interface PageHeaderProps {
  count?: number;
}

export default function PageHeader({ count }: PageHeaderProps) {
  return (
    <div className="my-8 flex items-center justify-between p-4">
      {/* Page title with count */}
      <div className="flex items-start">
        <h1 className="text-8xl leading-none font-medium">Post</h1>
        {count !== undefined && <span className="text-foreground font-mono text-xl">({count})</span>}
      </div>

      {/* Empty space for balance */}
      <div className="w-16"></div>
    </div>
  );
}
