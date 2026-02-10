import type { JSONContent } from '@tiptap/react';

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

export function extractTocFromContent(doc: JSONContent): TocItem[] {
  const toc: TocItem[] = [];

  if (!doc.content) return toc;

  for (const node of doc.content) {
    if (node.type === 'heading' && node.attrs?.id && node.attrs?.level) {
      toc.push({
        id: node.attrs.id as string,
        title: getTextFromContent(node.content),
        level: node.attrs.level as number,
      });
    }
  }

  return toc;
}
