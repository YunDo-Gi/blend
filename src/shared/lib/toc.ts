import { PostBlock } from '@/shared/types/api';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function extractTocFromBlocks(blocks: PostBlock[]): TocItem[] {
  const toc: TocItem[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/m;

  for (const block of blocks) {
    const match = headingRegex.exec(block.content);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();

      toc.push({
        id: block.id,
        title,
        level,
      });
    }
  }

  return toc;
}
