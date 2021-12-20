import { loadingWrapper, newLengthArray } from '../loadingWrapper'

const getItem = () => `<div class="sa-loading-inner"></div>`.trim()

export default (): HTMLElement => {
  const el = loadingWrapper(
    `
    <div class="sa-loading-tag">
      ${newLengthArray(12).map(() => getItem()).join('\n')}
    </div>
    `
    .trim()
  )
  
  el.className = `${el.className} sa-loading-alpha`

  return el
}