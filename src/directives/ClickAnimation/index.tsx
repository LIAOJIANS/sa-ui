import { delay } from "src/hooks"
import { watch, onBeforeUnmount } from "vue"
import './clickAnimation.scss'

interface ClickAnimationOptions {
  disabled?: boolean,
  size?: 'large' | 'normal' | 'mini'
}


function createClickAnimationManage(el: HTMLElement, o?: ClickAnimationOptions | string) {
  let option: ClickAnimationOptions
  let timer = null as null | number

  const onClick = () => {
    if(option.disabled || !!timer) { return }

    el.setAttribute('sa-click-node-waving', 'active')

    timer = setTimeout(() => {
      el.removeAttribute('sa-click-node-waving')
      timer = null
    }, 500) as number
  }

  const updataOption = (o?: ClickAnimationOptions | string) => {
    o = o || {}
    if(typeof o === 'string') {
      o = { size: o as any }
    }

    o.size = o.size || 'normal'

    option = o
  }

  updataOption(o)
  el.setAttribute(`sa-click-node-${option!.size}`, 'active')
  el.addEventListener('click', onClick, true)

  return {
    updataOption,
    destroy: () => {el.removeEventListener('click', onClick, true)},
  }
}


type AnimationManager = ReturnType<typeof createClickAnimationManage>

export function useClickAnimation({
  elGetter,
  optionsGetter
}: { 
  elGetter: () => HTMLElement | undefined | null,
  optionsGetter: () => string | ClickAnimationOptions
 }) {
  const state = {
    animationManage: null as null | AnimationManager
  }

  watch(elGetter, async el => {
    await delay(0)

    if(!!state.animationManage){ state.animationManage.destroy() }
    state.animationManage = null

    !!el && ( state.animationManage = createClickAnimationManage(el, !!optionsGetter ? optionsGetter() : undefined) )
  }, { immediate: true })

  !!optionsGetter && watch(optionsGetter, opt => {
    !!state.animationManage && state.animationManage.updataOption(opt)
  })

  onBeforeUnmount(() => {
    !!state.animationManage && state.animationManage.destroy()
  })
}