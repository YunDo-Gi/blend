import Image from 'next/image';
import Link from 'next/link';

interface PostItemProps {
  id: string;
  date: string;
  title: string;
  author: string;
  thumbnail?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tteokyi.com';

function resolveAssetUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

export default function PostItem({ id, date, title, author, thumbnail }: PostItemProps) {
  const thumbnailUrl = resolveAssetUrl(thumbnail);

  return (
    <Link
      href={`/posts/${id}`}
      className="border-line group flex cursor-pointer flex-col gap-3 border-b py-4 transition-all duration-300 md:grid md:grid-cols-12 md:gap-4"
    >
      <div className="bg-gray-2 relative aspect-video w-full overflow-hidden transition-transform md:hidden">
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt={title} fill sizes="100vw" unoptimized className="object-cover" />
        ) : null}
      </div>

      <div className="text-foreground hidden font-mono text-sm md:col-span-2 md:flex md:items-center">{date}</div>

      <div className="relative col-span-2 hidden w-36 max-w-full md:flex">
        <div className="bg-primary absolute inset-0 opacity-0 transition-all duration-600 ease-out group-hover:translate-x-1 group-hover:opacity-100"></div>
        <div className="bg-background border-line aspect-image group-hover:border-primary relative flex w-full items-center justify-center overflow-hidden border transition-all duration-600 ease-out group-hover:-translate-y-1">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={title} fill sizes="144px" unoptimized className="object-cover" />
          ) : null}
        </div>
      </div>

      <div className="hidden flex-col justify-between md:col-span-8 md:flex">
        <div className="text-foreground group-hover:text-primary text-2xl transition-colors duration-300">{title}</div>
        <div className="text-gray mt-1 font-mono text-xs">BY {author}</div>
      </div>

      <div className="text-foreground group-hover:text-primary text-base font-medium transition-colors duration-300 md:hidden">
        {title}
      </div>

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
