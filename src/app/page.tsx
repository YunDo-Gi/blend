import AuthorsSection from '@/domain/main/components/authors-section';
import RecentSection from '@/domain/main/components/recent-section';
import StatsSection from '@/domain/main/components/stats-section';
import FlipBoard from '@/domain/main/components/flip-board';
import LampToggle from '@/domain/main/components/lamp-toggle';
import NewsFactoryBar from '@/domain/main/components/news-factory-bar';
import CategoryIndexPanel from '@/domain/main/components/category-index-panel';

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-0">
      {/* row 1 - Hero */}
      <div className="border-line border-b">
        <div className="lg:border-line mx-auto max-w-7xl lg:border-x">
          <NewsFactoryBar />
        </div>
      </div>

      {/* row 2 - Recent + Stats */}
      <div className="border-line border-b-[1.5px]">
        <div className="divide-line lg:border-line mx-auto grid max-w-7xl grid-cols-1 divide-y md:grid-cols-2 md:divide-y-0 lg:grid-cols-12 lg:border-x">
          <div className="md:border-line p-(--layout-grid-padding) md:border-r lg:col-span-7">
            <RecentSection />
          </div>
          <div className="lg:border-line p-(--layout-grid-padding) lg:col-span-3 lg:border-r">2</div>
          <div className="hidden flex-col justify-between lg:col-span-2 lg:flex">
            <LampToggle />
            <div className="mt-4">
              <StatsSection />
            </div>
          </div>
        </div>
      </div>

      {/* row 3 - Authors */}
      <div className="border-line border-b">
        <div className="divide-line lg:border-line mx-auto grid max-w-7xl grid-cols-1 divide-y md:grid-cols-2 md:divide-y-0 lg:grid-cols-12 lg:border-x">
          <div className="border-line relative overflow-hidden p-(--layout-grid-padding) md:border-r lg:col-span-7 lg:col-start-3 lg:row-start-1">
            <div
              aria-hidden="true"
              className="bg-foreground pointer-events-none absolute bottom-0 left-0 h-14 w-full"
            />
            <div
              aria-hidden="true"
              className="border-line bg-background pointer-events-none absolute bottom-0.5 left-0 h-14 w-full rounded-bl-[2.25rem]"
            />
            4
          </div>
          <div className="relative p-(--layout-grid-padding) lg:col-span-3 lg:col-start-10 lg:row-start-1">
            <div
              aria-hidden="true"
              className="bg-foreground pointer-events-none absolute bottom-0 left-0 h-0.5 w-full"
            />

            <AuthorsSection />
          </div>
          <div className="lg:border-line hidden p-(--layout-grid-padding) lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:block lg:border-r">
            <CategoryIndexPanel />
          </div>
        </div>
      </div>

      {/* row 4 - FlipBoard (md and up) */}
      <div className="border-line hidden border-b md:block">
        <div className="border-line mx-auto grid max-w-7xl grid-cols-12 border-x">
          <div className="col-span-12 p-(--layout-grid-padding)">
            <FlipBoard />
          </div>
        </div>
      </div>

      {/* row 5 */}
      <div className="border-line border-b">
        <div className="lg:border-line mx-auto max-w-7xl p-(--layout-grid-padding) lg:border-x">10</div>
      </div>

      {/* row 6 */}
      <div className="border-line">
        <div className="lg:border-line mx-auto max-w-7xl p-(--layout-grid-padding) lg:border-x">11</div>
      </div>
    </div>
  );
}
