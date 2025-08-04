'use client';

import { ReactNode } from 'react';

interface InteractiveParagraphProps {
  children: ReactNode;
  id?: string;
}

export default function InteractiveParagraph({ children, id }: InteractiveParagraphProps) {
  const handleClick = () => {
    if (id) {
      const event = new CustomEvent('selectParagraph', { detail: id });
      window.dispatchEvent(event);
    }
  };

  return (
    <p 
      id={id}
      className="mb-4 leading-relaxed text-foreground cursor-pointer hover:bg-gray-light/50 transition-colors duration-200 rounded p-1 -m-1"
      onClick={handleClick}
    >
      {children}
    </p>
  );
}