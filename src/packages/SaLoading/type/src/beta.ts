import { loadingWrapper, newLengthArray } from "../loadingWrapper";

const getItem = (index: number) => `<div class="plain-loading-tag plain-loading-tag-${index + 1}">
<div class="plain-loading-inner plain-loading-inner-${index + 1}"></div>
</div>`.trim()

export default (): HTMLElement => {
  const el = loadingWrapper(`
    ${newLengthArray(9).map((_, i) => getItem(i)).join('\n')}
  `.trim())

  el.className = `${el.className} sa-loading-beta`

  return el
}