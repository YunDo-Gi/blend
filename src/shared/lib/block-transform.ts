import type { JSONContent } from '@tiptap/react';
import type { PostBlock, PostBlockRequest } from '@/shared/types/api';

/**
 * API 블록 배열을 Tiptap JSON으로 변환 (글 조회 시)
 *
 * @example
 * const tiptapContent = apiToTiptap(post.blocks);
 * <PostViewer content={tiptapContent} />
 */
export function apiToTiptap(blocks: PostBlock[]): JSONContent {
  return {
    type: 'doc',
    content: blocks.map((block) => ({
      ...block.content,
      attrs: {
        ...block.content.attrs,
        id: block.id,
      },
    })),
  };
}

/**
 * Tiptap JSON을 API 블록 배열로 변환 (글 수정 시)
 *
 * @example
 * const blocks = tiptapToApi(editor.getJSON());
 * await postApi.updateContent(postId, { blocks });
 */
export function tiptapToApi(content: JSONContent): PostBlockRequest[] {
  if (!content.content || content.content.length === 0) {
    return [];
  }

  return content.content.map((node) => {
    const { id, ...restAttrs } = node.attrs || {};

    const block: PostBlockRequest = {
      content: {
        type: node.type,
        content: node.content,
        marks: node.marks,
        ...(Object.keys(restAttrs).length > 0 ? { attrs: restAttrs } : {}),
      },
    };

    // 기존 블록인 경우 ID 포함
    if (id) {
      block.id = id;
    }

    return block;
  });
}

/**
 * API 블록 배열에서 블록 ID 목록 추출
 */
export function extractBlockIdsFromApi(blocks: PostBlock[]): string[] {
  return blocks.map((block) => block.id);
}
