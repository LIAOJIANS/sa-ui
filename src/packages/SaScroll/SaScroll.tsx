import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, throttle, unit, useRefs, useStyles } from "src/hooks";
import { computed, onBeforeUnmount, reactive, watch } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";
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
  setup({ props, slots }) {

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

    const targetScrollBarSize = computed(() => {
      if(!props.scrollX) {
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
      if(!mounted.value) { 
        return style
       }

      if(props.fitContentHeight) {
        style.height = unit(state.contentHeight)
      }

      return style
    })

    const wrapperStyle = useStyles(style => {
      if(!mounted.value) { 
        return style
       }

      if(props.fitContentHeight) {
        style.height = unit(state.contentHeight + 17)
      }
      
      return style
    })

    const contentStyle = useStyles(style => {
      if(!mounted.value) {
        return style
      }

      if(!props.scrollX) {
        style.width = props.fitContentWidth && state.contentWidth > 0 ? unit(state.contentWidth) : '100%'
        style.overflowX = 'hidden'
      }

      if(!props.scrollY) {
        style.height = props.fitContentHeight && state.contentHeight > 0 ? unit(state.contentHeight) : '100%'
        style.overflowY = 'hidden'
      }

      if(props.fitContentWidth) {
        style.width = '100%'
      }

      if(props.fitContentHeight) {
        style.height = '100%'
      }

      if( props.fitHostWidth ) {
        style.width = unit(state.contentWidth)
      }

      if(props.fitHostHeight) {
        style.height = unit(state.contentHeight)
      }

      return style
    })

    const methods = {
      refresh() {
        
      }
    }

    
    /*-------------------------------------- handler ------------------------------------*/

    const handler = {
      windowResize: throttle(() => methods.refresh(), 500)
    }


    /*-------------------------------------- Vue ------------------------------------*/

    onMounted(() => window.addEventListener('resize', handler.windowResize))
    onBeforeUnmount(() => window.addEventListener('resize', handler.windowResize))

    watch(() => props.refreshState, methods.refresh)

    

    return {

      refer: {
        props,
        refs,
        slots,
        state,
        freezeState
      },

      render: () => <div
        ref={onRef.host}
        class={classes.value}
        style={ hostStyle.value }
      >
        <div
          ref={onRef.wrapper}
          style={ wrapperStyle.value }
        >
          <div
            class="sa-scroll-content"
            ref={onRef.content}
            style={ contentStyle.value }
          >
            { slots.default() }
          </div>
          { slots.content() }
        </div>

      </div>
    }
  }
})


export default SaScroll