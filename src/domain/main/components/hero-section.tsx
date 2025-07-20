import Link from 'next/link';

export default function HeroSection() {
  return (
    <section>
      <h1 className="text-foreground mb-4 font-serif text-8xl">
        Mix Thoughts, <br /> Blend
      </h1>
      <div className="flex flex-row items-center justify-between gap-4">
        <p className="text-foreground mb-8 text-lg">
          계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 가슴 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은 쉬
        </p>
        <Link
          href="/posts"
          className="text-foreground border-foreground hover:bg-primary/75 border border-dotted px-6 py-3 font-mono font-medium transition-colors"
        >
          VIEW POSTS →
        </Link>
      </div>
    </section>
  );
}
