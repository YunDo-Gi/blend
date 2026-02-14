import Link from 'next/link';

interface PostItemProps {
  id: string;
  date: string;
  title: string;
  author: string;
}

export default function PostItem({ id, date, title, author }: PostItemProps) {
  return (
    <Link
      href={`/posts/${id}`}
      className="border-line group flex cursor-pointer flex-col gap-3 border-b py-4 transition-all duration-300 md:grid md:grid-cols-12 md:gap-4"
    >
      {/* 모바일 썸네일 */}
      <div className="bg-gray-2 aspect-video w-full transition-transform md:hidden"></div>

      {/* 데스크톱 Date */}
      <div className="text-foreground hidden font-mono text-sm md:col-span-2 md:flex md:items-center">{date}</div>

      {/* 데스크톱 Thumbnail */}
      <div className="relative col-span-2 hidden md:flex">
        <div className="bg-primary aspect-image absolute w-36 opacity-0 transition-all duration-600 ease-out group-hover:translate-x-1 group-hover:opacity-100"></div>
        <div className="bg-background border-line aspect-image group-hover:border-primary relative flex w-36 items-center justify-center border transition-all duration-600 ease-out group-hover:-translate-y-1"></div>
      </div>

      {/* 데스크톱 Title + Author */}
      <div className="hidden flex-col justify-between md:col-span-8 md:flex">
        <div className="text-foreground group-hover:text-primary text-2xl transition-colors duration-300">{title}</div>
        <div className="text-gray mt-1 font-mono text-xs">BY {author}</div>
      </div>

      {/* 모바일 Title */}
      <div className="text-foreground group-hover:text-primary text-base font-medium transition-colors duration-300 md:hidden">
        {title}
      </div>

      {/* 모바일 Date + Author */}
      <div className="text-gray flex items-center gap-2 font-mono text-xs md:hidden">
        <span>{date}</span>
        {author && (
          <>
            <span>·</span>
            <span>BY {author}</span>
          </>
        )}
      </div>
    </Link>
  );
}
