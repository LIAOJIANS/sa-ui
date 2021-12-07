import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, DEFAULT_STATUS, StyleProps, useStyle } from "src/hooks";
import { computed, PropType } from "vue";
import './SaButton.scss'


export const SaButton = designComponent({
  name: 'Sa-Button',

  props: {
    mode: { type: String as PropType<'plain | fill | text'>, default: 'fill' },
    title: { type: String },
    style: { type: Object },
    ...StyleProps
  },

  slots: ['default'],
  setup({ props, slots }) {

    const { styleComputed } = useStyle({ status: DEFAULT_STATUS })

    console.log(props.style);
    

    const classes = computed(() => classname([
      'sa-button',
      'sa-click-node',
      `sa-button-status-${styleComputed.value.status}`,
      `sa-button-size-${styleComputed.value.size}`,
      `sa-button-shape-${styleComputed.value.status}`,
      `sa-button-mode-${props.mode}`
    ]))

    return {
      render: () => {
        return (
          <button class={classes.value} style={ props.style }><span>{ slots.default.isExist() ? slots.default() : props.title }</span></button>
        )
      }
    }
  }
})

export default SaButton