'use client';

import LampIcon from '@/components/icons/lamp3.svg';
import { useTheme } from 'next-themes';

export default function ClickableLampIcon() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex flex-col items-center p-2"
        aria-label="램프 아이콘 클릭"
      >
        <LampIcon className={`h-fit w-32 p-0 transition-colors duration-700 ease-in-out`} />
        <div
          className={`from-primary relative h-4 w-12 bg-gradient-to-b to-transparent ${theme === 'dark' ? 'opacity-50' : 'opacity-0'} transition-opacity delay-300 duration-700 ease-in-out`}
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)' }}
        ></div>
      </button>
    </div>
  );
}
