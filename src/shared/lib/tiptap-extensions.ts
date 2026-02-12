import { Extension } from '@tiptap/react';

/** 블록 ID Extension이 적용되는 노드 타입 */
const BLOCK_TYPES = [
  'paragraph',
  'heading',
  'codeBlock',
  'blockquote',
  'bulletList',
  'orderedList',
  'horizontalRule',
] as const;

interface BlockIdExtensionOptions {
  /** 에디터 모드 (true: 편집 가능, false: 읽기 전용) */
  editable?: boolean;
}

/**
 * 블록 노드에 고유 ID를 부여하는 Tiptap Extension
 *
 * - 에디터 모드 (editable: true): ID 자동 생성 안 함, 기존 ID만 유지
 * - 뷰어 모드 (editable: false): 서버에서 받은 ID로 data-block-id 렌더링
 */
export function createBlockIdExtension(options: BlockIdExtensionOptions = {}) {
  const { editable = false } = options;

  return Extension.create({
    name: 'blockId',

    addGlobalAttributes() {
      return [
        {
          types: [...BLOCK_TYPES],
          attributes: {
            id: {
              default: null,
              renderHTML: (attributes) => {
                // ID가 없으면 아무것도 렌더링 안 함
                if (!attributes.id) {
                  return {};
                }

                // 뷰어 모드: id, data-block-id, class 추가
                if (!editable) {
                  return {
                    id: attributes.id,
                    'data-block-id': attributes.id,
                    class: 'block-with-comment',
                  };
                }

                // 에디터 모드: ID가 있으면 유지 (새 블록은 ID 없음)
                return {};
              },
            },
          },
        },
      ];
    },
  });
}

/** 뷰어용 BlockId Extension (읽기 전용, 댓글 시스템용 data-block-id 렌더링) */
export const BlockIdExtension = createBlockIdExtension({ editable: false });

/** 에디터용 BlockId Extension (ID 자동 생성 안 함, 서버에서 생성) */
export const EditableBlockIdExtension = createBlockIdExtension({ editable: true });
