interface PostItemProps {
  date: string;
  title: string;
}

export default function PostItem({ date, title }: PostItemProps) {
  return (
    <div className="border-line hover:bg-primary/50 group grid cursor-pointer grid-cols-12 gap-4 border-b py-4 transition-colors">
      {/* Date */}
      <div className="text-foreground col-span-2 flex items-center font-mono text-sm">{date}</div>

      {/* Thumbnail placeholder */}
      <div className="relative col-span-2 flex">
        {/* Shadow/Background rectangle */}
        <div 
          className="bg-foreground aspect-image absolute w-36 opacity-0 transition-all group-hover:translate-x-2 group-hover:opacity-100"
          style={{
            transitionDuration: 'var(--animation-duration-toggle-theme)',
            transitionTimingFunction: 'var(--easing-toggle-theme)'
          }}
        ></div>
        {/* Main thumbnail */}
        <div 
          className="bg-background border-line aspect-image relative flex w-36 items-center justify-center border transition-all group-hover:-translate-y-2 group-hover:transform"
          style={{
            transitionDuration: 'var(--animation-duration-toggle-theme)',
            transitionTimingFunction: 'var(--easing-toggle-theme)'
          }}
        ></div>
      </div>

      {/* Title */}
      <div className="text-foreground col-span-8 text-2xl">{title}</div>
    </div>
  );
}
