import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, useRefs, useStyles } from "src/hooks";
import { computed, PropType } from "vue";
import SaRow from "../SaRow/SaRow";

export type GridColSize = number | {
  span: number,
  offest: number
}

export type SingleClass = string | {
  [key: string]: boolean | null | undefined
} | null | undefined

export const SaCol = designComponent({
  name: 'sa-col',

  props: {
    span: { type: [String, Number] as PropType<string | number> },
    order: { type: [String, Number] },
    offset: { type: [String, Number] },
    push: { type: [String, Number] },
    pull: { type: [String, Number] },
    className: { type: String },
    xs: {type: [Number, Object] as PropType<GridColSize>},
    sm: {type: [Number, Object] as PropType<GridColSize>},
    md: {type: [Number, Object] as PropType<GridColSize>},
    lg: {type: [Number, Object] as PropType<GridColSize>},
  },
  inheritPropsType: HTMLDivElement,
  slots: ['default'],
  setup({ props, slots }) {

    const { refs, onRef } = useRefs({
      el: HTMLDivElement
    })

    const row = SaRow.use.inject()

    const classes = computed(() => {
      const classList = [
        'sa-col',
        {
          [`sa-col-span-${props.span}`]: props.span,
          [`sa-col-order-${props.order}`]: props.order,
          [`sa-col-offset-${props.offset}`]: props.offset,
          [`sa-col-push-${props.push}`]: props.push,
          [`sa-col-pull-${props.pull}`]: props.pull,
          [`${props.className}`]: !!props.className
        }
      ] as SingleClass[]
      const sizeProps = props;

      (['xs', 'sm', 'md', 'lg'] as ['xs', 'sm', 'md', 'lg']).forEach(s => {
        if (typeof sizeProps[s] === 'number') {
          classList.push(`sa-col-${s}-${sizeProps[s]}`);
        } else if (typeof sizeProps[s] === 'object') {
          let obj = sizeProps[s];
          !!obj && Object.entries(obj).forEach(([key, val]) => classList.push(key !== 'span' ? `sa-col-${s}-${key}-${val}` : `sa-col-span-${s}-${val}`))
        }
      })

      return classname(classList)

    })

    const styles = useStyles(style => {
      if ((Number(row.props.gut)) !== 0) {
          style = {
              paddingLeft: (Number(row.props.gut)) / 2 + 'px',
              paddingRight: (Number(row.props.gut)) / 2 + 'px'
          };
      }
      return style;
  })

    return {
      refer: {
        refs
      },
      render: () => <div
        class={classes.value}
        style={ styles.value }
        ref={onRef.el}
      >
        {slots.default()}
      </div>
    }
  }
})

export default SaCol