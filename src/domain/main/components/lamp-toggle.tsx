'use client';

import LampIcon from '../../../shared/icons/lamp3.svg';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ClickableLampIcon() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 하이드레이션 에러 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 서버와 클라이언트 초기 상태 동일하게 유지
    return (
      <div className="flex flex-col items-center">
        <button
          className="flex cursor-pointer flex-col items-center"
          aria-label="램프 아이콘 클릭"
        >
          <LampIcon className={`h-fit w-32 p-0`} />
          <div
            className="from-primary relative h-4 w-12 bg-gradient-to-b to-transparent opacity-0 transition-opacity delay-300"
            style={{ 
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
              transitionDuration: 'var(--animation-duration-toggle-theme)',
              transitionTimingFunction: 'var(--easing-toggle-theme)'
            }}
          ></div>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex cursor-pointer flex-col items-center"
        aria-label="램프 아이콘 클릭"
      >
        <LampIcon className={`h-fit w-32 p-0`} />
        <div
          className={`from-primary relative h-4 w-12 bg-gradient-to-b to-transparent ${theme === 'dark' ? 'opacity-50' : 'opacity-0'} transition-opacity delay-300`}
          style={{ 
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
            transitionDuration: 'var(--animation-duration-toggle-theme)',
            transitionTimingFunction: 'var(--easing-toggle-theme)'
          }}
        ></div>
      </button>
    </div>
  );
}
