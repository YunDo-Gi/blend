import HeroSection from '@/components/main/hero-section';
import LampToggle from '@/components/lamp-toggle';

export default function Home() {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-10 gap-0">
      {/* row 1 */}
      <div className="border-line col-span-10 border-b p-(--layout-grid-padding)">
        <HeroSection />
      </div>
      {/* row 2 */}
      <div className="border-line col-span-5 border-r border-b p-(--layout-grid-padding)">2</div>
      <div className="border-line col-span-3 border-r border-b p-(--layout-grid-padding)">3</div>
      <div className="border-line col-span-2 border-b">
        <LampToggle />
      </div>
      {/* row 3 */}
      <div className="border-line col-span-5 border-r border-b p-(--layout-grid-padding)">4</div>
      <div className="border-line col-span-3 border-r border-b p-(--layout-grid-padding)">5</div>
      <div className="border-line col-span-2 border-b p-(--layout-grid-padding)">7</div>
      {/* row 4 */}
      <div className="border-line col-span-5 border-r border-b p-(--layout-grid-padding)">8</div>
      <div className="border-line col-span-5 border-b p-(--layout-grid-padding)">9</div>
      {/* row 5 */}
      <div className="border-line col-span-10 border-b p-(--layout-grid-padding)">10</div>
      {/* row 6 */}
      <div className="border-line col-span-10 border-b p-(--layout-grid-padding)">11</div>
    </div>
  );
}
