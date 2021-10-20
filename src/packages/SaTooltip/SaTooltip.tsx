import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, unit, useModel, useStyles } from "src/hooks";
import { computed, PropType } from "vue";
import './tooltip.scss'

export const SaTooltip = designComponent({
  name: 'sa-tooltip',

  props: {
    show: { type: Boolean },

    content: { type: String },
    theme: { type: String as PropType<'dark' | 'light'>, default: 'dark' },

    width: { type: [String, Number] }
  },

  emits: {
    onUpdateModelValue: (val?: boolean) => true
  },

  slots: ['default'],

  setup({ props, event: { emit }, slots }) {

    const modelValue = useModel(() => props.show, emit.onUpdateModelValue)

    const classes = computed(() => classname([
      'sa-tooltip',
      `sa-tooltip-theme-${props.theme}`
    ]))

    const styles = useStyles(style => {
      if (!!props.width) {
        style.width = unit(props.width)
      }

      return style
    })

    const publicProps = computed(() => ({
      direction: "top",
      style: styles.value,
      class: classes.value
    } as any))

    return {
      render: () => {

        if (!slots.default.isExist()) {
          console.error('Cannot have no root node!')
          return null
        }

        if (Array.isArray(slots.default) && slots.default.length > 1) {
          console.error('allows only one child node!')
          return null
        }

        return (
          <div {...publicProps.value}>
            <div class="sa-tooltip-content" >
              {props.content}
            </div>


            <div >
              {
                slots.default()
              }
            </div>
          </div>
        )
      }
    }
  }
})

export default SaTooltip