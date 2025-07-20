'use client';

import LampIcon from '../../../shared/icons/lamp3.svg';
import { useTheme } from 'next-themes';

export default function ClickableLampIcon() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex cursor-pointer flex-col items-center"
        aria-label="램프 아이콘 클릭"
      >
        <LampIcon className={`h-fit w-32 p-0`} />
        <div
          className={`from-primary relative h-4 w-12 bg-gradient-to-b to-transparent ${theme === 'dark' ? 'opacity-50' : 'opacity-0'} transition-opacity delay-300 duration-(--animation-duration-toggle-theme) ease-(--easing-toggle-theme)`}
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)' }}
        ></div>
      </button>
    </div>
  );
}
