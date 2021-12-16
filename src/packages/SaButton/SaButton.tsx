import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, DEFAULT_STATUS, StyleProps, useRefs, useStyle } from "src/hooks";
import { computed, PropType } from "vue";
import './SaButton.scss'
import { useClickAnimation } from "src/directives/ClickAnimation";
import SaIcon from "../SaIcon/SaIcon";

export const SaButton = designComponent({
  name: 'Sa-Button',

  props: {
    mode: { type: String as PropType<'plain | fill | text'>, default: 'fill' },
    lable: { type: String },
    tip: { type: String },
    style: { type: Object },
    icon: { type: String },
    disabled: { type: Boolean, default: false },
    type: {type: String, default: 'button'},
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
      `sa-button-shape-${styleComputed.value.shape}`,
      `sa-button-mode-${props.mode}`,

      {
        'sa-button-icon': !!props.icon,
        'sa-button-has-icon': !!props.icon,
        'sa-button-icon-only': !!props.icon && !props.lable && !slots.default.isExist()
        
      }
    ]))

    useClickAnimation({ elGetter: () => refs.el, optionsGetter: () => ({ size: props.size, disabled: props.disabled }) })
    return {
      render: () => {
        return (
          <button
          onClick={(e: MouseEvent) => emit.onClick(e)}
            ref={ onRef.el }
            class={classes.value}
            title={props.tip || ''}
            style={props.style}>
              {!!props.icon ? <SaIcon icon={props.icon}/> : null}
              { slots.default.isExist() ? <span>{slots.default()}</span> : !!props.lable ? <span>{props.lable}</span> : null}
          </button>
        )
      }
    }
  }
})

export default SaButton