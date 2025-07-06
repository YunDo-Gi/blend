interface StatItem {
  count: number;
  label: string;
}

const stats: StatItem[] = [
  {
    count: 147,
    label: 'POSTS',
  },
  {
    count: 8,
    label: 'CATEGORIES',
  },
];

export default function StatsSection() {
  return (
    <div className="border-line space-y-2 border-t py-(--layout-grid-padding)">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2 pl-(--layout-grid-padding)">
          <div className="bg-gray-foreground h-1 w-1 rounded-full"></div>
          <span className="text-gray-foreground font-mono text-xs font-medium">
            {stat.count} {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
