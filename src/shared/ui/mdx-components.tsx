import { ReactNode } from 'react';
import InteractiveParagraph from './interactive-paragraph';
import CounterButton from './counter-button';

interface HeadingProps {
  children: ReactNode;
  id?: string;
}

interface ParagraphProps {
  children: ReactNode;
  id?: string;
}

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

interface LinkProps {
  href: string;
  children: ReactNode;
}

interface ImageProps {
  src: string;
  alt: string;
  title?: string;
}

interface BlockquoteProps {
  children: ReactNode;
}

interface ListProps {
  children: ReactNode;
}

interface TableProps {
  children: ReactNode;
}

// H1 컴포넌트
export function H1({ children, id }: HeadingProps) {
  return (
    <h1 id={id} className="text-foreground border-line mt-12 mb-6 border-b pb-4 text-4xl leading-tight font-bold">
      {children}
    </h1>
  );
}

// H2 컴포넌트
export function H2({ children, id }: HeadingProps) {
  return (
    <h2 id={id} className="text-foreground mt-10 mb-4 text-2xl font-semibold">
      {children}
    </h2>
  );
}

// H3 컴포넌트
export function H3({ children, id }: HeadingProps) {
  return (
    <h3 id={id} className="text-foreground mt-8 mb-3 text-xl font-medium">
      {children}
    </h3>
  );
}

// H4 컴포넌트
export function H4({ children, id }: HeadingProps) {
  return (
    <h4 id={id} className="text-foreground mt-6 mb-3 text-lg font-medium">
      {children}
    </h4>
  );
}

// H5 컴포넌트
export function H5({ children, id }: HeadingProps) {
  return (
    <h5 id={id} className="text-foreground mt-4 mb-2 text-base font-medium">
      {children}
    </h5>
  );
}

// H6 컴포넌트
export function H6({ children, id }: HeadingProps) {
  return (
    <h6 id={id} className="text-foreground mt-4 mb-2 text-sm font-medium">
      {children}
    </h6>
  );
}

// 문단 컴포넌트
export function Paragraph({ children, id }: ParagraphProps) {
  return <InteractiveParagraph id={id}>{children}</InteractiveParagraph>;
}

// 코드 블록 컴포넌트
export function CodeBlock({ children, className }: CodeBlockProps) {
  const language = className?.replace('language-', '') || '';

  return (
    <div className="mb-6">
      {language && (
        <div className="text-foreground border-line bg-gray-2 border-b px-4 py-2 font-mono text-sm">{language}</div>
      )}
      <pre className="bg-gray-2 overflow-x-auto p-4 text-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

// 인라인 코드 컴포넌트
export function InlineCode({ children }: { children: ReactNode }) {
  return <code className="text-foreground bg-gray-2 rounded px-1.5 py-0.5 font-mono text-sm">{children}</code>;
}

// 링크 컴포넌트
export function Link({ href, children }: LinkProps) {
  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="text-primary hover:text-primary/80 underline transition-colors"
    >
      {children}
    </a>
  );
}

import NextImage from 'next/image';

// 이미지 컴포넌트
export function Image({ src, alt, title }: ImageProps) {
  return (
    <figure className="mb-6">
      <NextImage
        src={src}
        alt={alt}
        title={title}
        className="border-line w-full rounded border"
        loading="lazy"
        width={800}
        height={450}
        style={{ width: '100%', height: 'auto' }}
      />
      {title && <figcaption className="text-gray mt-2 text-center text-sm">{title}</figcaption>}
    </figure>
  );
}

// 인용문 컴포넌트
export function Blockquote({ children }: BlockquoteProps) {
  return <blockquote className="border-line mb-6 border-l-4 pl-2 italic">{children}</blockquote>;
}

// 순서 없는 목록 컴포넌트
export function UnorderedList({ children }: ListProps) {
  return <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>;
}

// 순서 있는 목록 컴포넌트
export function OrderedList({ children }: ListProps) {
  return <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>;
}

// 목록 아이템 컴포넌트
export function ListItem({ children }: { children: ReactNode }) {
  return <li className="text-foreground leading-relaxed">{children}</li>;
}

// 테이블 컴포넌트
export function Table({ children }: TableProps) {
  return (
    <div className="mb-6 overflow-x-auto">
      <table className="border-line w-full border-collapse border">{children}</table>
    </div>
  );
}

// 테이블 헤더 컴포넌트
export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-light">{children}</thead>;
}

// 테이블 바디 컴포넌트
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

// 테이블 행 컴포넌트
export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="border-line hover:bg-gray-light/50 border-b">{children}</tr>;
}

// 테이블 헤더 셀 컴포넌트
export function TableHeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-line text-foreground border-r px-4 py-3 text-left font-semibold">{children}</th>;
}

// 테이블 데이터 셀 컴포넌트
export function TableDataCell({ children }: { children: ReactNode }) {
  return <td className="border-line text-foreground border-r px-4 py-3">{children}</td>;
}

// 구분선 컴포넌트
export function HorizontalRule() {
  return <hr className="border-line my-8" />;
}

// MDX 컴포넌트 맵
export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: Paragraph,
  pre: CodeBlock,
  code: InlineCode,
  a: Link,
  img: Image,
  blockquote: Blockquote,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableHeaderCell,
  td: TableDataCell,
  hr: HorizontalRule,
  CounterButton,
};
