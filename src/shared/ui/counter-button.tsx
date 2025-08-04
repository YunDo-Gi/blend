'use client';

import { useState } from 'react';

export default function CounterButton() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-light rounded-lg border border-line my-4">
      <p className="text-foreground font-medium">카운터: {count}</p>
      <div className="flex gap-2">
        <button
          onClick={() => setCount(count - 1)}
          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
        >
          -
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-3 py-1 bg-gray border border-line rounded hover:bg-gray/80 transition-colors"
        >
          리셋
        </button>
      </div>
    </div>
  );
}