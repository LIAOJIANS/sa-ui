

export function loadingWrapper(template: string): HTMLElement {
  const div = document.createElement('div')

  div.className = 'sa-content-loading'

  div.innerHTML = template

  return div
}


export const newLengthArray = (length: string | number, fill: any = ''): any[] => new Array(length).fill(fill)