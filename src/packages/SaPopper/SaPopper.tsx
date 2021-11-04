import { designComponent } from 'src/advancedComponentionsApi/designComponent'
import { classname, getElement, nextIndex, useModel, useNumber, useRefs, useStyles } from 'src/hooks'
import { markRaw } from 'vue'
import { Teleport, PropType, computed, reactive, onMounted } from 'vue'
import './popper.scss'
import { PopperTrigger } from './trigger/PopperTrigger'


export const SaPopper = designComponent({

  name: 'sa-popper',

  props: {
    modelValue: { type: Boolean },

    tirgger: { type: String, default: 'hover' },
    transition: { type: String, defualt: 'sa-transition-fade' },
    message: { type: String },
    title: { type: String },

    width: { type: [String, Number] },
    height: { type: [Number, String] },
    noContentPadding: { type: Boolean },

    reference: { type: [Object, Function] as PropType<HTMLElement | (() => HTMLElement)> },
    placement: { type: String, default: 'bottom-start' }
  },

  slots: ['default', 'head'],

  emits: {
    onUpdateModelValue: (val?: boolean) => true,
    onEnterPopper: (e: MouseEvent) => true,
    onLeavePopper: (e: MouseEvent) => true,
    onShow: () => true
  },

  setup({ props, event: { emit }, slots, attrs }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue, { autoEmit: false, autoWatch: false })

    const { refs, onRef } = useRefs({
      comment: HTMLElement,
      popper: HTMLDivElement,
      content: HTMLDivElement
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
      trigger: null | PopperTrigger
    }

    const { numberState } = useNumber(props, [
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

      if (!!state.referenceEl) {
        if (['top', 'bottom'].indexOf(direction.value) > -1) {
          styles.width = (state.referenceEl as HTMLElement).offsetWidth + 'px'
        } else if (['left', 'right'].indexOf(direction.value) > -1) {
          styles.height = (state.referenceEl as HTMLElement).offsetHeight + 'px'
        }
      }

      return styles
    })

    const popperStyles = useStyles(style => {

      style.zIndex = state.zIndex
    })

    const popperClasses = computed(() => classname([
      'sa-popper',
      'sa-popper-box',
      'sa-popper-show-arrow',
      props.transition,
      {
        'sa-popper-show': model.value,
        'sa-popper-no-content-padding': props.noContentPadding
      }
    ]))

    const utils = {
      init() {

      }
    }

    const methods = {
      show: (shouldEmit = true) => {
        if(!state.init) {
          state.init = true
        }

        state.zIndex = nextIndex()
        model.value = true
        emit.onShow()
        if(shouldEmit) {
          emit.onUpdateModelValue(model.value)
        }

        state.onTransitionend = () => {
          state.onTransitionend = null
        }
      }
    }
    onMounted(async () => {
      const popper = getElement(onRef.popper)
      const comment = getElement(onRef.comment)
      const reference = !!comment ? comment!.nextElementSibling as HTMLElement : null
      state.el = markRaw({ popper, comment, reference })

      await utils.init()

      if(model.value) {
        await methods.show(false)
      }
    })

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
            <Teleport to='.main'>
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
                  ... (props.tirgger === 'hover' ? {
                    onMouseenter: e => emit.onEnterPopper(e),
                    onMouseleave: e => emit.onLeavePopper(e)
                  } : {})
                  }
                >
                  <div class="plain-popper-arrow" />
                  {(slots.head.isExist() || !!props.title) && <div class="sa-popper-title">
                    {slots.head(props.title)}
                  </div>}
                  {
                    (props.message || slots.default.isExist()) &&
                    <div class="sa-popper-content-inner" style={sizeStyle.value}>{props.message || slots.default()}</div>
                  }
                </div>
              </div>
            </Teleport>
          </>
        )
      }
    }
  }
})


export default SaPopper