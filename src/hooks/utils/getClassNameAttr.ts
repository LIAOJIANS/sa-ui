export function getClassNameAttr(el: HTMLElement) {
  const { className } = el
  if (!className || typeof className != "string") {
    return ''
  }
  return className
}