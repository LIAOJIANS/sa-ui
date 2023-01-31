
 import {getClassNameAttr} from "./getClassNameAttr";

 export const removeClass = (el: null | undefined | HTMLElement, rmCls: null | undefined | string | string[]): void => {
     if (!el || !rmCls) return;
 
     let rmClasses;
     if (Array.isArray(rmCls)) {
         rmClasses = rmCls
     } else {
         rmClasses = (rmCls as string).split(' ')
     }
 
     if (!!el.classList && !!el.classList.value) {
         rmClasses.forEach(item => el.classList.remove(item))
     } else {
         const curClasses = getClassNameAttr(el).split(' ')
         for (let i = 0; i < rmClasses.length; i++) {
             const rmClass = rmClasses[i];
             const index = curClasses.indexOf(rmClass)
             if (index > -1) {
                 curClasses.splice(index, 1)
                 i--
             }
         }
         el.className = curClasses.join(' ')
     }
 }