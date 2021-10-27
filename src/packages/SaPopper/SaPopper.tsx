import { designComponent } from 'src/advancedComponentionsApi/designComponent'
import { classname, nextIndex, useModel, useNumber, useStyles } from 'src/hooks'
import { Teleport, PropType, computed, reactive } from 'vue'
import './popper.scss'


export const SaPopper = designComponent({

  name: 'sa-popper',

  props: {
    modelValue: { type: Boolean },


    tirgger: { type: String, default: 'hover' },
    transition: { type: String, defualt: 'sa-transition-fade' },
    messages: { type: String },

    width: { type: [String, Number] },
    height: { type: [Number, String] },
    noContentPadding: { type: Boolean },

    reference: { type: [Object, Function] as PropType<HTMLElement | (() => HTMLElement)> },
    placement: { type: String, default: 'bottom-start' }
  },

  slots: ['default'],

  emits: {
    onUpdateModelValue: (val?: boolean) => true,
  },

  setup({ props, event: { emit }, slots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue, { autoEmit: false, autoWatch: false })


    const state = reactive({
      el: {
        popper: null as null | HTMLElement,
        commen: null as null | HTMLElement,
        reference: null as null | HTMLElement
      },

      referenceEl: null as null | HTMLElement,   // 真正的refe 元素
      zIndex: nextIndex()
    })

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

      return styles
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
            <Teleport to='#app'>
              <div
                class={popperClasses.value}
              >

                {props.messages ? <span>{props.messages}</span> : childDoms}
              </div>
            </Teleport>
          </>
        )
      }
    }
  }
})


export default SaPopper