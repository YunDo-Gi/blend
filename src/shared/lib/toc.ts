import type { JSONContent } from '@tiptap/react';
import type { PostBlock } from '@/shared/types/api';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

function getTextFromContent(content?: JSONContent[]): string {
  if (!content) return '';
  return content
    .map((node) => {
      if (node.type === 'text') return node.text || '';
      if (node.content) return getTextFromContent(node.content);
      return '';
    })
    .join('');
}

/**
 * API 블록 배열에서 TOC 추출
 */
export function extractTocFromBlocks(blocks: PostBlock[]): TocItem[] {
  const toc: TocItem[] = [];

  for (const block of blocks) {
    if (block.content.type === 'heading' && block.content.attrs?.level) {
      toc.push({
        id: block.id,
        title: getTextFromContent(block.content.content),
        level: block.content.attrs.level as number,
      });
    }
  }

  return toc;
}
