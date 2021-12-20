import { loadingWrapper, newLengthArray } from "../loadingWrapper";


const getUse = (): string => newLengthArray(5).map(index => `<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bar" transform="rotate(${index * 60},60,60)"></use>`).join('\n')


export default (loading: boolean = true): HTMLElement => {
  const el = loadingWrapper(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="${!loading ? 'plain-loading-ice-inactive' : ''}">
      ${getUse()}
      <symbol id="bar">
        <polyline points="60,8 60,30 70,15 60,30 50,15 60,30 60,60 60,40 70,30 60,60" style="fill:none"></polyline>
      </symbol>
    </svg>
  `.trim())
    
  el.className = `${el.className} sa-loading-ice`

  return el
}