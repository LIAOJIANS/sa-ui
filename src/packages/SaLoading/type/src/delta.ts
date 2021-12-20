import { loadingWrapper } from "../loadingWrapper"


export default (): HTMLElement => {
  const el = loadingWrapper(`
    <svg viewBox="0 0 110 110"> 
      <circle cx="55" cy="55" r="50"/>
    </svg>
  `.trim())

  el.className = `${el.className} sa-loading-delta`

  return el
}