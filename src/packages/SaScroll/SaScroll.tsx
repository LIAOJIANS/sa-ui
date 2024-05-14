import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { ResizeDetectFuncParam, useResizeDetector } from "src/directives/ResizeDetector";
import { classname, delay, throttle, unit, useRefs, useStyles } from "src/hooks";
import { computed, onBeforeUnmount, reactive, watch } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";
import { debounce } from "../SaPopper/popperUtils/popperUtils";
import VerticalScrollbar from './VerticalScrollbar'
import HorizontalScrollbar from './HorizontalScrollbar'
import './SaScroll.scss'

export enum SA_SCROLL_VERTICAL_POSITION {
  top = 'top',
  center = 'center',
  bottom = 'bottom'
}

export const SaScroll = designComponent({

  name: 'sa-scroll',

  props: {
    refreshState: {},                                                                               // 监听改属性，以便自动执行refresh刷新
    scrollbarSize: { type: Number },                                                                  // 滚动条大小
    scrollbarColor: { type: String, default: 'rgba(144,147,153,.3)' },                                // 滚动条颜色
    scrollX: { type: Boolean },                                                                       // 可以横向滚动
    scrollY: { type: Boolean, default: true },                                                        // 可以纵向滚动
    hideScrollbar: { type: Boolean },                                                                 // 隐藏滚动条
    alwaysShowScrollbar: { type: Boolean },                                                           // 一直显示滚动条
    fitContentWidth: { type: Boolean },                                                               // 适配内容宽度
    fitContentHeight: { type: Boolean },                                                              // 适配内容高度
    fitHostWidth: { type: Boolean },                                                                  // 适配容器宽度
    fitHostHeight: { type: Boolean },                                                                 // 适配容器高度
    topThreshold: { type: Number, default: 20 },                                                      // 距离顶部多少距离派发滚动到顶部事件
    bottomThreshold: { type: Number, default: 20 },                                                   // 距离底部多少距离派发滚动到底部事件
    autoScrollSpeed: { type: Number, default: 400 },                                                  // 自动滚动的时候的速度，每秒钟滚动的距离
    scrollAfterDragEnd: { type: Boolean, },                                                           // 是否拖拽结束后才刷新滚动位置
    disableListTransition: { type: Boolean, },                                                        // 是否股弄懂的时候禁用pl-list的队列动画
    horizontalScrollbarTooltip: { type: String },                                                     // 横向滚动条tooltip显示文本
    verticalScrollbarTooltip: { type: String },                                                       // 纵向滚动条tooltip显示文本
  },
  inheritPropsType: HTMLDivElement,
  slots: ['content', 'default'],
  provideRefer: true,
  emits: {
    onScroll: (e: Event) => true,
    onVerticalScrollCenter: (e: Event) => true,
    onVerticalScrollTop: (e: Event) => true,
    onVerticalScrollBottom: (e: Event) => true
  },
  setup({ props, slots, event: { emit, on, off } }) {

    const { refs, onRef } = useRefs({
      host: HTMLDivElement,
      wrapper: HTMLDivElement,
      content: HTMLDivElement
    })

    /* --------------------------------------- state ------------------------------- */

    let mounted = ref(false)
      ; (() => {
        onMounted(() => mounted.value = true) // 渲染
        onBeforeUnmount(() => mounted.value = false) // 卸载
      })()

    const freezeState = {
      verticalPosition: SA_SCROLL_VERTICAL_POSITION.top,                  // 当前滚动纵向位置，top，center，right
      cancelAnimate: null as null | number,                               // 自动滚动动画计时器
      wrapperScrollTop: 0,                                                // 容器 scrollTop
      wrapperScrollLeft: 0,                                               // 容器 scrollLeft
      emitScroll: true,                                                   // 当前是否派发scroll事件

      _isDragging: false,
      get isDragging() {
        return this._isDragging
      },

      set isDragging(val: boolean) {
        this._isDragging = val
        if (val) {
          refs.host!.setAttribute('is-dragging', '')
        } else {
          refs.host!.removeAttribute('is-dragging')
        }
      },
    }

    const state = reactive({
      contentWidth: 0,                                                    // 内容宽度
      contentHeight: 0,                                                   // 内容高度
      hostWidth: 0,                                                       // 容器宽度
      hostHeight: 0,                                                      // 容器高度
    })

    /* --------------------------------- computed -------------------------------- */

    const targetScrollbarSize = computed(() => {
      if (!props.scrollX) {
        return props.scrollbarSize || 6
      } else {
        return props.scrollbarSize || 9
      }
    })

    const classes = computed(() => classname([
      'sa-scroll',
      {
        'sa-scroll-always-show-scroll-bar': props.alwaysShowScrollbar,
      }
    ]))

    const hostStyle = useStyles(style => {
      if (!mounted.value) {
        return style
      }

      if (props.fitContentHeight) {
        style.height = unit(state.contentHeight)
      }

      return style
    })

    const wrapperStyle = useStyles(style => {
      if (!mounted.value) {
        return style
      }

      if (props.fitContentHeight) {
        style.height = unit(state.contentHeight + 17)
      }

      return style
    })

    const contentStyle = useStyles(style => {
      if (!mounted.value) {
        return style
      }

      if (!props.scrollX) {
        style.width = props.fitContentWidth && state.contentWidth > 0 ? unit(state.contentWidth) : '100%'
        style.overflowX = 'hidden'
      }

      if (!props.scrollY) {
        style.height = props.fitContentHeight && state.contentHeight > 0 ? unit(state.contentHeight) : '100%'
        style.overflowY = 'hidden'
      }

      if (props.fitContentWidth) {
        style.width = unit(state.contentWidth)
      }

      if (props.fitContentHeight) {
        style.height = unit(state.contentHeight)
      }

      if (props.fitHostWidth) {
        style.width = '100%'
      }

      if (props.fitHostHeight) {
        style.height = '100%'
      }

      return style
    })

    /* -------------------------- methods ------------------------- */

    const methods = {
      refresh: async () => {
        await delay()

        if (!refs.content) { return }

        const { scrollHeight: contentHeight, scrollWidth: contentWidht } = refs.content!

        handler.contentResize({
          width: Math.ceil(contentWidht),
          height: Math.ceil(contentHeight)
        })

        const { scrollHeight: hostHeight, scrollWidth: hostWidth } = refs.host!

        handler.hostResize({
          width: Math.ceil(hostWidth),
          height: Math.ceil(hostHeight)
        })
      },

      async scroll(point: { x?: number, y?: number }, configOrTime?: number | { time?: number, noEmitScroll?: boolean }) {

        if (!refs.wrapper) return

        const config = typeof configOrTime === "number" ? { time: configOrTime } : configOrTime
        const { time, noEmitScroll } = (config || {})

        if (noEmitScroll) {
          freezeState.emitScroll = false
        }
        const done = () => noEmitScroll && (freezeState.emitScroll = true)

        if (!time) {
          if (point.x != null) refs.wrapper!.scrollLeft = point.x
          if (point.y != null) refs.wrapper!.scrollTop = point.y
          await delay(23)
          done()
        } else {

          if (!!freezeState.cancelAnimate) {
            cancelAnimationFrame(freezeState.cancelAnimate)
            freezeState.cancelAnimate = null
          }

          let ny = refs.wrapper!.scrollTop
          let nx = refs.wrapper!.scrollLeft

          let ky = (point.y! - ny) / time
          let kx = (point.x! - nx) / time

          let startTime = Date.now()
          const run = async () => {
            let nowTime = Date.now()
            let delta = nowTime - startTime
            let top;
            let left;

            if (delta >= time) {
              freezeState.cancelAnimate = null
              top = time * ky + ny
              left = time * kx + nx

              if (!!refs.wrapper) {
                refs.wrapper.scrollTop = top
                refs.wrapper.scrollLeft = left
                await delay(23)
                done()
              }
            } else {
              top = delta * ky + ny
              left = delta * kx + nx

              if (!!refs.wrapper) {
                refs.wrapper.scrollTop = top
                refs.wrapper.scrollLeft = left
              }
              freezeState.cancelAnimate = requestAnimationFrame(run)
            }
          }
          run()
        }
      },

      scrollTop(scrollTop: number, time?: number) {
        methods.scroll({ y: scrollTop }, { time })
      },

      disableListTransition: () => {
        const disabledQueueAnimation = debounce(() => refs.host!.removeAttribute('virtual-scrolling'), 300, true)

        return () => {
          refs.host!.setAttribute('virtual-scrolling', '')
          disabledQueueAnimation()
        }
      }
    }


    /*-------------------------------------- handler ------------------------------------*/

    const handler = {
      windowResize: throttle(() => methods.refresh(), 500),

      hostResize: (data: ResizeDetectFuncParam) => {
        const { width, height } = data

        if (width != null) {
          state.hostWidth = width - 16
        }

        if (height != null) {
          state.hostHeight = height - 16
        }
      },

      contentResize: (data: ResizeDetectFuncParam) => {
        const { width, height } = data

        if (width != null) {
          state.contentWidth = width
        }

        if (height != null) {
          state.contentHeight = height
        }

      },

      wrapperScroll: (e: Event) => {
        const target = e.target as HTMLElement

        freezeState.wrapperScrollTop = target.scrollTop
        freezeState.wrapperScrollLeft = target.scrollLeft

        if (freezeState.emitScroll) {
          emit.onScroll(e)
        }

        if (
          freezeState.verticalPosition === SA_SCROLL_VERTICAL_POSITION.top &&
          freezeState.wrapperScrollTop > props.topThreshold
        ) {
          emit.onVerticalScrollCenter(e) // 进入center

          freezeState.verticalPosition = SA_SCROLL_VERTICAL_POSITION.center
        } else if (freezeState.verticalPosition === SA_SCROLL_VERTICAL_POSITION.center) {
          if (freezeState.wrapperScrollTop < props.topThreshold!) {
            emit.onVerticalScrollTop(e) // 进入top

            freezeState.verticalPosition = SA_SCROLL_VERTICAL_POSITION.top
          } else {
            emit.onVerticalScrollBottom(e)

            freezeState.verticalPosition = SA_SCROLL_VERTICAL_POSITION.bottom
          }
        } else if (freezeState.verticalPosition === SA_SCROLL_VERTICAL_POSITION.bottom) {
          if (state.contentHeight - state.hostHeight - freezeState.wrapperScrollTop > props.bottomThreshold!) {
            emit.onVerticalScrollBottom(e)

            freezeState.verticalPosition = SA_SCROLL_VERTICAL_POSITION.bottom
          }
        }

        if (props.disableListTransition) {
          methods.disableListTransition()
        }
      },

      wrapperMousewheel: () => {
        if (!!freezeState.cancelAnimate) {
          cancelAnimationFrame(freezeState.cancelAnimate)
          freezeState.cancelAnimate = null
        }
      }
    }


    /*-------------------------------------- Vue ------------------------------------*/

    onMounted(() => window.addEventListener('resize', handler.windowResize))
    onBeforeUnmount(() => window.addEventListener('resize', handler.windowResize))

    watch(() => props.refreshState, methods.refresh)

    useResizeDetector({ elGetter: () => refs.host, onResize: handler.hostResize })
    useResizeDetector({ elGetter: () => refs.content, onResize: handler.contentResize })
    

    return {

      refer: {
        props,
        refs,
        on,
        off,
        slots,
        state,
        freezeState,
        targetScrollbarSize,
        methods,
        handler
      },

      render: () => <div
        ref={onRef.host}
        class={classes.value}
        style={hostStyle.value}
      >
        <div
          ref={onRef.wrapper}
          class="sa-scroll-wrapper"
          style={wrapperStyle.value}
          onScroll={handler.wrapperScroll}
          onWheel={handler.wrapperMousewheel}
        >
          <div
            class="sa-scroll-content"
            ref={onRef.content}
            style={contentStyle.value}
          >
            {slots.default()}
          </div>
          {slots.content()}
        </div>
        {
          !props.hideScrollbar && props.scrollY && (
            <div class="sa-vertical-scrollbar-wrapper">
              {/* 虚拟列表 ---- Y*/}
              {<VerticalScrollbar tooltip={props.verticalScrollbarTooltip} />}
            </div>
          )
        }

        {
          !props.hideScrollbar && props.scrollX && (
            <div class="sa-horizontal-scrollbar-wrapper">
              {/* 虚拟列表 ---- X */}
              {<HorizontalScrollbar tooltip={props.horizontalScrollbarTooltip} />}
            </div>
          )
        }
      </div>
    }
  }
})


export default SaScroll