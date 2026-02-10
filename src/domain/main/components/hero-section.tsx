import Link from 'next/link';

export default function HeroSection() {
  return (
    <section>
      <h1 className="text-foreground mb-4 font-serif text-4xl md:text-6xl lg:text-8xl">
        Mix Thoughts, <br /> Blend
      </h1>
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-foreground text-sm md:text-lg">
          계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 가슴 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은 쉬
        </p>
        <Link
          href="/posts"
          className="text-foreground border-foreground hover:bg-primary/75 shrink-0 border border-dotted px-4 py-2 font-mono text-sm font-medium transition-colors md:px-6 md:py-3 md:text-base"
        >
          VIEW POSTS →
        </Link>
      </div>
    </section>
  );
}
