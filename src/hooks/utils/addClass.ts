
import { getClassNameAttr } from "./getClassNameAttr";

export const addClass = (el: HTMLElement | null | undefined, addCLs: null | undefined | string | string[]): void => {
  if (!el || !addCLs) return;
  let addClasses;
  if (Array.isArray(addCLs)) {
    addClasses = addCLs
  } else {
    addClasses = (addCLs as string).split(' ')
  }
  if (!!el.classList && !!el.classList.value) {
    addClasses.forEach(item => el.classList.add(item))
  } else {
    const curClasses = getClassNameAttr(el).split(' ')
    addClasses.forEach(item => {
      if (curClasses.indexOf(item) === -1) curClasses.push(item)
    })
    el.className = curClasses.join(' ')
  }
}