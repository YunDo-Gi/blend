'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-gray font-mono text-sm">[LIGHT] DARK</div>;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-foreground hover:text-primary font-mono text-sm transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <span className="text-gray">LIGHT </span>
          <span className="text-foreground">[DARK]</span>
        </>
      ) : (
        <>
          <span className="text-foreground">[LIGHT]</span>
          <span className="text-gray"> DARK</span>
        </>
      )}
    </button>
  );
}
