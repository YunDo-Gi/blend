/**
 * 특정 요소로 부드럽게 스크롤
 * @param elementId - 스크롤할 요소의 ID
 * @param options - 스크롤 옵션
 */
export function scrollToElement(
  elementId: string,
  options: { behavior?: ScrollBehavior; block?: ScrollLogicalPosition } = {}
): boolean {
  const { behavior = 'smooth', block = 'center' } = options;
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({ behavior, block });
    return true;
  }

  return false;
}
