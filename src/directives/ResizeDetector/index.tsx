import { delay } from "src/hooks"
import { onBeforeUnmount } from "vue"
import { watch } from "vue"

export interface ResizeDetectFuncParam {
  width?: number,
  height?: number,
  oldWidth?: number,
  oldHeight?: number,
  el?: HTMLElement,

  [key: string]: any
}

export interface ResizeDetectFunc { (option: ResizeDetectFuncParam): void }

function createResizeDetector(el: HTMLElement, callback: ResizeDetectFunc) {
  const state = {
    observer: undefined as undefined | MutationObserver,
    width: undefined as undefined | number,
    height: undefined as undefined | number,
    oldWidth: undefined as undefined | number,
    oldHeight: undefined as undefined | number,
  }

  const runCallBack = (data: ResizeDetectFuncParam) => {
    Object.keys(data).forEach(k => {
      if (data[k] != null && typeof data[k] === "number") {
        data[k] = Math.ceil(data[k])
      }
    })

    callback(data)
  }

  const detect = () => {
    const { scrollWidth: width, scrollHeight: height } = el

    if (width === state.width && height === state.height) { return }

    const ref = {} as ResizeDetectFuncParam

    if (width !== state.width) {
      ref.width = width
      ref.oldWidth = state.width
      state.width = width
    }

    if (height !== state.height) {
      ref.height = height
      ref.oldHeight = state.height
      state.height = height
    }

    runCallBack(ref)
  }

  const destroy = () => {
    if (!!state.observer) {
      state.observer.disconnect()
      state.observer = undefined
    }
  }


  const init = () => {
    if (!el) { return console.error(`el is ${typeof el}`) }

    state.observer = new MutationObserver(detect)
    state.observer.observe(el, { childList: true, subtree: true })
    const { scrollHeight, scrollWidth } = el

    state.height = scrollHeight
    state.width = scrollWidth

    runCallBack({ ...state, el })
  }

  init()


  return {
    detect,
    destroy
  }
}


type ResizeDetector = ReturnType<typeof createResizeDetector>

export function useResizeDetector(
  {
    elGetter,
    onResize
  }: {
    elGetter: () => HTMLElement | undefined | null,
    onResize: ResizeDetectFunc
  }
) {
  const state = { resizeDetector: null as null | ResizeDetector }

  watch(elGetter, async el => {
    await delay(0)

    if (!!state.resizeDetector) {
      state.resizeDetector.destroy()
    }

    state.resizeDetector = null

    !!el && (
      state.resizeDetector = createResizeDetector(el, onResize)
    )
  }, { immediate: true })

  !!state.resizeDetector && state.resizeDetector.detect()

  onBeforeUnmount(() => {
    !!state.resizeDetector && state.resizeDetector.destroy()
  })
}