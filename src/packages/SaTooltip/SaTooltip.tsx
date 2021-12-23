import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, unit, useModel, useRefs } from "src/hooks";
import { computed, onMounted, onUpdated, PropType, reactive } from "vue";
import './tooltip.scss'
import { SaPopper } from "../SaPopper/SaPopper";
import { debounce } from "../SaPopper/popperUtils/popperUtils";

export const SaTooltip = designComponent({
  name: 'sa-tooltip',

  props: {
    modelValue: { type: Boolean },

    tooltip: { type: String },
    theme: { type: String as PropType<'dark' | 'light'>, default: 'dark' },
    placement: { type: String, default: 'top-center' },

    width: { type: [String, Number] }
  },

  inheritPropsType: SaPopper,

  emits: {
    onUpdateModelValue: (val?: boolean) => true
  },

  slots: ['default', 'popper'],

  setup({ props, event: { emit }, slots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const state = reactive({
      srcollWidth: 0,
      offsetWidth: 0
    })

    const { refs, onRef } = useRefs({
      el: HTMLElement,
      popper: SaPopper
    })

    const classes = computed(() => classname([
      'sa-tooltip',
      `sa-tooltip-theme-${props.theme}`
    ]))

    const refresh = debounce(() => {
      if (!refs.el) return
      const { scrollWidth, offsetWidth } = refs.el
      if (state.srcollWidth != scrollWidth) state.srcollWidth = scrollWidth
      if (state.offsetWidth != offsetWidth) state.offsetWidth = offsetWidth
    }, 100)

    if (props.width) {
      onUpdated(refresh)
      onMounted(refresh)
    }

    return {
      render: () => {
        return <>
          <SaPopper
            v-model={model.value}
            ref={onRef.popper}
            disabled={!!props.width ? state.offsetWidth === state.srcollWidth : false}
            placement={props.placement}
            popperClass={classes.value}
            v-slots={{
              default: () => !!props.width ? (
                <span class="sa-tooltip-reference"
                  ref={onRef.el}
                  style={{ width: unit(props.width)! }}>
                  {slots.default()}
                </span>
              ) : slots.default(),
              popper: () => slots.popper(props.tooltip)
            }}
          >

          </SaPopper>
        </>
      }
    }
  }
})

export default SaTooltip