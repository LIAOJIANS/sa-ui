import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, DEFAULT_STATUS, StyleProps, useEdit, useRefs, useStyle, EditProps, useStyles, unit } from "src/hooks";
import { computed, CSSProperties, PropType } from "vue";
import './button.scss'
import { useClickAnimation } from "src/directives/ClickAnimation";
import SaIcon from "../SaIcon/SaIcon";
import SaLoading from "../SaLoading/SaLoading";

export const SaButton = designComponent({
  name: 'Sa-Button',

  props: {
    mode: { type: String as PropType<'plain | fill | text'>, default: 'fill' },
    lable: { type: String },
    tip: { type: String },
    icon: { type: String },
    type: { type: String, default: 'button' },
    block: {type: Boolean},
    noPadding: { type: Boolean },

    ...StyleProps,
    ...EditProps,
  },

  emits: {
    onClick: (e: MouseEvent) => true
  },

  slots: ['default'],
  setup({ props, slots, event: { emit } }) {

    const { styleComputed } = useStyle({ status: DEFAULT_STATUS })
    const { editComputed } = useEdit()
    const { refs, onRef } = useRefs({
      el: HTMLElement
    })

    const styles = useStyles(style => {
      if(!props.noPadding) {
        style.marginRight = unit(10)
      }
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
        'sa-button-icon-only': !!props.icon && !props.lable && !slots.default.isExist(),
        'sa-button-disabled': !!editComputed.value.disabled,
        'sa-button-block': !!props.block,
      }
    ]))

    useClickAnimation({ elGetter: () => refs.el, optionsGetter: () => ({ size: props.size, disabled: editComputed.value.editable }) })
    return {
      render: () => {
        return (
          <button
            onClick={(e: MouseEvent) => emit.onClick(e)}
            ref={onRef.el}
            class={classes.value}
            title={props.tip || ''}
            disabled={editComputed.value.disabled!}
            style={{ ...styles.value, ...props.style as any }}
          >
            {!!props.loading && <SaLoading />}
            {!!props.icon && !editComputed.value.loading ? <SaIcon icon={props.icon} /> : null}
            {slots.default.isExist() ? <span>{slots.default()}</span> : !!props.lable ? <span>{props.lable}</span> : null}
          </button>
        )
      }
    }
  }
})

export default SaButton