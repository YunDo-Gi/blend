import { Extension } from '@tiptap/react';
import { v4 as uuidv4 } from 'uuid';

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
  /** ID 생성 함수 (기본: uuid v4) */
  generateId?: () => string;
}

/**
 * 블록 노드에 고유 ID를 부여하는 Tiptap Extension
 *
 * @param options.editable - true면 에디터용 (ID 생성, data-id 사용), false면 뷰어용 (id, data-block-id 사용)
 * @param options.generateId - 커스텀 ID 생성 함수
 */
export function createBlockIdExtension(options: BlockIdExtensionOptions = {}) {
  const { editable = false, generateId = uuidv4 } = options;

  return Extension.create({
    name: 'blockId',

    addGlobalAttributes() {
      return [
        {
          types: [...BLOCK_TYPES],
          attributes: {
            id: {
              default: null,
              parseHTML: editable ? (element) => element.getAttribute('data-id') : undefined,
              renderHTML: (attributes) => {
                if (!attributes.id) {
                  // 에디터 모드에서 ID가 없으면 새로 생성
                  if (editable) {
                    return { 'data-id': generateId() };
                  }
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

                // 에디터 모드: data-id만 추가
                return { 'data-id': attributes.id };
              },
            },
          },
        },
      ];
    },

    onCreate() {
      // 에디터 모드에서만 ID가 없는 노드에 ID 부여
      if (!editable) return;

      const { tr } = this.editor.state;
      let modified = false;

      this.editor.state.doc.descendants((node, pos) => {
        if (node.type.spec.group === 'block' && !node.attrs.id) {
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, id: generateId() });
          modified = true;
        }
      });

      if (modified) {
        this.editor.view.dispatch(tr);
      }
    },
  });
}

/** 뷰어용 BlockId Extension (읽기 전용) */
export const BlockIdExtension = createBlockIdExtension({ editable: false });

/** 에디터용 BlockId Extension (편집 가능, ID 자동 생성) */
export const EditableBlockIdExtension = createBlockIdExtension({ editable: true });
