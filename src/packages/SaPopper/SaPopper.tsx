import { designComponent } from 'src/advancedComponentionsApi/designComponent'
import { SimpleFunction } from 'src/advancedComponentionsApi/emit'
import { classname, delay, getElement, nextIndex, useModel, useNumber, useRefs, useStyles } from 'src/hooks'
import { clickBodyListeners } from 'src/hooks/utils/clickBodyListeners'
import { markRaw,createCommentVNode, onBeforeUnmount, watch, Teleport, PropType, computed, reactive, onMounted  } from 'vue'
import './popper.scss'
import { Popper } from './popperUtils/popper'
import { debounce } from './popperUtils/popperUtils'
import { refreshPopperReference } from './refershPopperReference'
import { getProperTrigger, PopperTrigger, ProperTriggerType } from './trigger/PopperTrigger'


export const SaPopper = designComponent({

  name: 'sa-popper',

  props: {
    modelValue: { type: Boolean },

    tirgger: { type: String, default: 'hover' },
    transition: { type: String, default: 'sa-transition-fade' },
    message: { type: String },
    title: { type: String },

    width: { type: [String, Number] },
    height: { type: [Number, String] },
    noContentPadding: { type: Boolean },

    reference: { type: [Object, Function] as PropType<HTMLElement | (() => HTMLElement)> },
    placement: { type: String, default: 'bottom-start' },

    offset: { type: [Number, String] },
    arrow: { type: Boolean, default: true },
    boundary: { default: document.body as any }
  },

  slots: ['default', 'head', 'popper'],

  emits: {
    onUpdateModelValue: (val?: boolean) => true,
    onShow: () => true,
    onHide: () => true,
    onInit: () => true,

    onClickReference: (e: MouseEvent) => true,
    onClickPopper: (e: MouseEvent) => true,
    onClickBody: (e: MouseEvent) => true,
    onMousedownPopper: (e: MouseEvent) => true,

    onEnterReference: (e: MouseEvent) => true,
    onLeaveReference: (e: MouseEvent) => true,
    onEnterPopper: (e: MouseEvent) => true,
    onLeavePopper: (e: MouseEvent) => true,
    onReferenceFocus: (e: FocusEvent) => true,
    onReferenceBlur: (e: FocusEvent) => true,
  },

  setup({ props, event, slots, attrs }) {

    const { emit, on, off } = event

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue, { autoEmit: false, autoWatch: false })

    const { refs, onRef } = useRefs({
      comment: HTMLElement,
      popper: HTMLDivElement,
      content: HTMLDivElement
    })

    watch(() => props.modelValue, (val) => {
      if(val === model.value) {
        return
      }
      console.log(model.value === val);
      val ? methods.show(false) : methods.hide(false)

      
    })


    const state = reactive({
      el: {
        popper: null as null | HTMLElement,
        comment: null as null | HTMLElement,
        reference: null as null | HTMLElement
      },

      referenceEl: null as null | HTMLElement,   // 真正的refe 元素
      zIndex: nextIndex(),
      onTransitionend: null as null | ((e: Event) => void),
      trigger: null as null | PopperTrigger,
      popper: null as null | Popper,
      init: false
    }) as {
      el: {
        popper: null | HTMLElement,
        comment: null | HTMLElement,
        reference: null | HTMLElement,
      },
      referenceEl: null | HTMLElement,
      zIndex: number,
      onTransitionend: null | ((e: Event) => void),
      init: boolean,
      trigger: null | PopperTrigger,
      popper: null | Popper,
    }

    const { numberState } = useNumber(props, [
      'hoverOpenDelay',
      'hoverCloseDelay',
      'height',
      'width',
      'offset'
    ])

    const direction = computed(() => {
      const [direction] = props.placement.split('-')

      return direction as 'top' | 'left' | 'bottom' | 'right'
    })

    const sizeStyle = useStyles(styles => {
      const { height, width } = numberState
      height !== null && (
        styles.height = `${height}px`
      )
      width !== null && (
        styles.width = `${width}px`
      )

      // if (!!state.referenceEl) {
      //   if (['top', 'bottom'].indexOf(direction.value) > -1) {
      //     // styles.width = (state.referenceEl as HTMLElement).offsetWidth + 'px'
      //   } else if (['left', 'right'].indexOf(direction.value) > -1) {
      //     // styles.height = (state.referenceEl as HTMLElement).offsetHeight + 'px'
      //   }
      // }

      return styles
    })

    const popperStyles = useStyles(style => {

      style.zIndex = state.zIndex
    })

    const popperClasses = computed(() => classname([
      'sa-popper',
      'sa-popper-box',
      props.transition,
      {
        'sa-popper-show': model.value,
        'sa-popper-open': model.value,
        'sa-popper-no-content-padding': props.noContentPadding,
        'sa-popper-show-arrow': props.arrow
      }
    ]))

    const utils = {
      init: (): boolean => {
        let { comment, reference } = state.el

        console.log(reference);
        

        if (!!comment && !!reference) {
          state.referenceEl = reference
        } else if (!!props.reference) {
          state.referenceEl = getElement(typeof props.reference === 'function' ? (props.reference as SimpleFunction)() : props.reference)
        } else { // 没有reference，等待reference初始化在初始化popper
          return false
        }

        utils.bindEvent()

        state.trigger = getProperTrigger(props.tirgger as ProperTriggerType, {
          model,
          show: methods.show,
          hide: methods.hide,

          hoverOpenDelay: numberState.hoverOpenDelay as number,
          hoverCloseDelay: numberState.hoverCloseDelay as number,

          reference: state.referenceEl as HTMLElement,

          on,
          off,
          emit
        })

        state.trigger.init()
        emit.onInit()

        return true
      },

      destroy() {
        utils.unbindEvents()
        if (!!state.trigger) {
          state.trigger.destroy()
        }

        if (!!state.popper) {
          state.popper.destroy()
        }
      },

      bindEvent() {
        if (!!state.referenceEl) {
          state.referenceEl.addEventListener('click', handler.onClickReference)
        }

        clickBodyListeners.listen(handler.onClickBody)
      },

      initPopper() {
        state.popper = new Popper({
          popper: refs.popper!,
          reference: state.referenceEl!,
          padding: 50,
          placement: props.placement as any,
          offset: Number(props.offset || (!!props.arrow ? 0 : 2)),
          boundary: props.boundary as any,
          arrowSize: !props.arrow ? 0 : undefined,
          shouldUpdate: () => !!model.value
        })
      },

      unbindEvents() {

      }
    }

    const handler = {
      onClickReference: (e: MouseEvent) => {
        emit.onClickReference(e)
      },

      onClickBody: (e: MouseEvent) => {
        if (!model.value) {
          return
        }

        if (state.referenceEl?.contains(e.target as Node)) { // 点击了reference 节点
          return
        }

        if (!!refs.content && refs.content!.contains(e.target as Node)) { // 点击了content节点
          return
        }

        emit.onClickBody(e)
      }
    }

    const methods = {
      show: async (shouldEmit = true) => {
        if (!state.init) {
          state.init = true

          await delay()
          utils.initPopper()
        }

        await delay(50)

        state.zIndex = nextIndex()
        model.value = true
        emit.onShow()
        if (shouldEmit) {
          emit.onUpdateModelValue(model.value)
        }

        state.onTransitionend = () => {
          state.onTransitionend = null
        }
      },

      hide: (shouldEmit = true) => {
        model.value = false
        emit.onHide()

        if(shouldEmit) {
          emit.onUpdateModelValue(model.value)
        }

        // state.onTransitionend = () => state.onTransitionend = null
      },
      refreshReference: async () => {
        await delay()
        const comment = getElement(refs.comment)
        const reference = !!comment ? comment!.nextElementSibling as HTMLElement : null
        console.log(reference, state.el.reference)
        if (!!reference && reference !== state.el.reference) {
            await utils.destroy()
            state.el.reference = markRaw(reference)
            await utils.init()
        }
    }
    }
    onMounted(async () => {
      const popper = getElement(refs.popper)
      const comment = getElement(refs.comment)
      const reference = !!comment ? comment!.nextElementSibling as HTMLElement : null
      
      state.el = markRaw({ popper, comment, reference })

      await utils.init()

      if (model.value) {
        await methods.show(false)
      }
    })

    onBeforeUnmount(() => utils.destroy())
    const popperConfigChangeHandler = debounce(async () => {
      await delay()
      await utils.destroy()
      await utils.init()
      if (!state.referenceEl) {
          if (!!state.popper) {
              state.popper.destroy()
              state.popper = null
          }
          return
      }
      if (!!state.popper) {
          await utils.initPopper()
      }
  }, 50)
    
    watch(() => props.arrow, popperConfigChangeHandler)
    refreshPopperReference.provide(methods.refreshReference)


    const Comment = createCommentVNode('') as any
    

    return {
      render: () => {
        let childDoms = slots.default()
        if (!!childDoms) {
          if (Array.isArray(childDoms)) {
            if (childDoms.length > 1) {
              console.error('allows only one child node!')
            }

            childDoms = childDoms[0]
          }
        }

        return (
          <>
            {!!childDoms && <>
              <Comment ref={onRef.comment} />
              {childDoms}
            </>}

            {
              state.init && <Teleport to='.sa-root-service-container'>
                <div
                  class={popperClasses.value}
                  style={popperStyles.value}
                  ref={onRef.popper}
                  {...attrs}
                >
                  <div
                    class='sa-popper-content'
                    ref={onRef.content}
                    {
                    ...(props.tirgger === 'hover' ? {
                      onMouseenter: e => emit.onEnterPopper(e),
                      onMouseleave: e => emit.onLeavePopper(e)
                    } : {})
                    }
                  >
                    <div class="sa-popper-arrow" />
                    {(slots.head.isExist() || !!props.title) && <div class="sa-popper-title">
                      {slots.head(props.title)}
                    </div>}
                    {
                      (props.message || slots.popper.isExist()) &&
                      <div class="sa-popper-content-inner" style={sizeStyle.value}>{props.message || slots.popper()}</div>
                    }
                  </div>
                </div>
              </Teleport>
            }
          </>
        )
      }
    }
  }
})


export default SaPopper