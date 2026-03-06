'use client';

import LampIcon from '../../../shared/icons/lamp3.svg';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export default function ClickableLampIcon() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    // 서버와 클라이언트 초기 상태 동일하게 유지
    return (
      <div className="flex flex-col items-center">
        <button className="group flex cursor-pointer flex-col items-center" aria-label="램프 아이콘 클릭">
          <LampIcon className={`h-fit w-32 p-0`} />
          <div
            className="from-primary relative h-5 w-14 origin-top scale-y-70 bg-gradient-to-b to-transparent opacity-0 blur-[2px] transition-all duration-500 ease-out"
            style={{
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
            }}
          ></div>
        </button>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="group flex cursor-pointer flex-col items-center"
        aria-label="램프 아이콘 클릭"
      >
        <LampIcon className={`h-fit w-32 p-0`} />
        <div
          className={`from-primary relative h-5 w-14 origin-top bg-gradient-to-b to-transparent transition-all duration-500 ease-out ${
            isDark
              ? 'scale-y-100 opacity-55 blur-[2px] group-hover:scale-y-75 group-hover:opacity-10 group-hover:blur-[1px]'
              : 'scale-y-70 opacity-0 blur-[1px] group-hover:scale-y-100 group-hover:opacity-55 group-hover:blur-[3px]'
          }`}
          style={{
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
          }}
        ></div>
      </button>
    </div>
  );
}
