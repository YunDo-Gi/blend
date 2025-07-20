import HeroSection from '@/domain/main/components/hero-section';
import AuthorsSection from '@/domain/main/components/authors-section';
import RecentSection from '@/domain/main/components/recent-section';
import StatsSection from '@/domain/main/components/stats-section';
import FlipBoard from '@/domain/main/components/flip-board';
import LampToggle from '@/domain/main/components/lamp-toggle';

export default function Home() {
  return (
    <div className="grid grid-cols-10 gap-0">
      {/* row 1 */}
      <div className="border-line col-span-10 border-b">
        <div className="border-line mx-auto max-w-7xl border-x p-(--layout-grid-padding)">
          <HeroSection />
        </div>
      </div>

      {/* row 2 */}
      <div className="border-line col-span-10 border-b">
        <div className="border-line mx-auto grid max-w-7xl grid-cols-12 gap-0 border-x">
          <div className="border-line col-span-7 border-r p-(--layout-grid-padding)">
            <RecentSection />
          </div>
          <div className="border-line col-span-3 border-r p-(--layout-grid-padding)">2</div>
          <div className="border-line col-span-2 flex flex-col justify-between">
            <LampToggle />
            <div className="mt-4">
              <StatsSection />
            </div>
          </div>
        </div>
      </div>

      {/* row 3 */}
      <div className="border-line col-span-10 border-b">
        <div className="border-line mx-auto grid max-w-7xl grid-cols-12 gap-0 border-x">
          <div className="border-line col-span-7 border-r p-(--layout-grid-padding)">4</div>
          <div className="border-line col-span-3 border-r p-(--layout-grid-padding)">
            <AuthorsSection />
          </div>
          <div className="col-span-2 p-(--layout-grid-padding)">7</div>
        </div>
      </div>

      {/* row 4 */}
      <div className="border-line col-span-10 border-b">
        <div className="border-line mx-auto grid max-w-7xl grid-cols-12 gap-0 border-x">
          <div className="border-line col-span-10 border-r p-(--layout-grid-padding)">
            <FlipBoard />
          </div>
          <div className="col-span-2 p-(--layout-grid-padding)">7</div>
        </div>
      </div>

      {/* row 5 */}
      <div className="border-line col-span-10 border-b">
        <div className="border-line mx-auto max-w-7xl border-x p-(--layout-grid-padding)">10</div>
      </div>

      {/* row 6 */}
      <div className="border-line col-span-10">
        <div className="border-line mx-auto max-w-7xl border-x p-(--layout-grid-padding)">11</div>
      </div>
    </div>
  );
}
