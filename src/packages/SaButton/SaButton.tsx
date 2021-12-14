import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, DEFAULT_STATUS, StyleProps, useRefs, useStyle } from "src/hooks";
import { computed, PropType } from "vue";
import './SaButton.scss'
import { useClickAnimation } from "src/directives/ClickAnimation";

export const SaButton = designComponent({
  name: 'Sa-Button',

  props: {
    mode: { type: String as PropType<'plain | fill | text'>, default: 'fill' },
    title: { type: String },
    style: { type: Object },
    disabled: { type: Boolean, default: false },
    ...StyleProps
  },

  emits: {
    onClick: (e: MouseEvent) => true
  },

  slots: ['default'],
  setup({ props, slots, event: { emit } }) {

    const { styleComputed } = useStyle({ status: DEFAULT_STATUS })
    const { refs ,onRef } = useRefs({
      el: HTMLElement
    })

    const classes = computed(() => classname([
      'sa-button',
      'sa-click-node',
      `sa-button-status-${styleComputed.value.status}`,
      `sa-button-size-${styleComputed.value.size}`,
      `sa-button-shape-${styleComputed.value.status}`,
      `sa-button-mode-${props.mode}`
    ]))

    useClickAnimation({ elGetter: () => refs.el, optionsGetter: () => ({ size: props.size, disabled: props.disabled }) })
    return {
      render: () => {
        return (
          <button
          onClick={(e: MouseEvent) => emit.onClick(e)}
            ref={ onRef.el }
            class={classes.value}
            style={props.style}>
            <span>
              {slots.default.isExist() ? slots.default() : props.title}
            </span>
          </button>
        )
      }
    }
  }
})

export default SaButton