import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, unit, useRefs, useStyles } from "src/hooks";
import { computed, CSSProperties, PropType } from "vue";
import './SaRow.scss'

export enum GridAlign {
  left = 'left',
  center = 'center',
  right = 'right',
  top = 'top',
  middle = 'middle',
  bottom = 'bottom'
}

export enum GridJustify {
  start = "start",
  end = "start",
  center = "start",
  'space-around' = "space-around",
  'space-between' = "space-between",
}

export const SaRow = designComponent({
  name: 'Sa-Row',

  props: {
    type: { type: String as PropType<'flex' | undefined | null> },
    align: { type: String as PropType<keyof typeof GridAlign> },
    justify: { type: String as PropType<keyof typeof GridJustify> },
    gut: { type: [Number, String], default: 0 },
    style: { type: Object as PropType<{ [k in keyof CSSProperties]: number | null | string | undefined }> },
  },

  slots: ['default'],
  provideRefer: true,
  inheritPropsType: HTMLDivElement,
  setup({ props, slots }) {

    const { refs, onRef } = useRefs({
      el: HTMLDivElement
    })

    const classes = computed(() => classname([
      'sa-row',
      {
        [`sa-row-${props.type}`]: !!props.type,
        [`sa-row-${props.type}-${props.align}`]: !!props.align,
        [`sa-row-${props.type}-${props.justify}`]: !!props.justify,
      }
    ]))

    const styles = useStyles(style => {
      const gutter = Number(props.gut)
      if (gutter !== 0) {
        style = {
          width: `calc(100% + ${unit(props.gut)})`,
          marginLeft: `-${unit(Number(props.gut) / 2)}`
        };
      }
      return style
    })

    return {
      refer: {
        props,
        refs,
      },
      render: () => <div
        ref={onRef.el}
        style={{ ...styles.value, ...props.style as any }}
        class={classes.value}
      >
        {slots.default()}
      </div>
    }
  }
})

export default SaRow