import {
  designComponent
} from "src/advancedComponentionsApi/designComponent";
import { classname, TitleStyleProps, unit, useStyles } from "src/hooks";
import { computed, CSSProperties, PropType } from "vue";
import './title.scss'


export const SaTitle = designComponent({
  name: 'sa-title',

  props: {
    ...TitleStyleProps,
    title: { type: String },
    bgc: { type: [Boolean, String] },
    height: { type: [Number, String] },
    hidden: { type: Boolean },
    style: { type: Object as PropType<{ [k in keyof CSSProperties]: number | null | string | undefined }> }
  },

  slots: ['default'],

  setup({ props, slots }) {

    const classes = computed(() => classname([
      'sa-title',
      {
        ...methods.styleTileLine(),
        'sa-title-mode': !!props.mode,
        'sa-title-bgc': props.bgc,
        'sa-title-hidden': !!props.hidden
      }
    ]))


    const styles = useStyles(style => {

      if (props.height) {
        style.lineHeight = unit(props.height)
      }

      if (
        props.bgc &&
        typeof props.bgc === 'string'
      ) {
        style.backgroundColor = props.bgc
      }

      return {
        ...style,
        textAlign: props.direction
      }
    })

    const publicProps = computed(() => ({
      style: { ...styles.value, ...props.style },
      class: classes.value
    } as any))

    const methods = {
      styleTileLine<T extends { [k: string]: boolean }>(): { [k in keyof T]: boolean } | any {

        // vline = 竖线  hline = 横线
        const line: any = {
          vline: 'sa-title-left',
          hline: 'sa-title-bottom'
        }
        if (typeof props.mode === 'object') {
          return {
            [`sa-title-${props.mode.direction}`]: true
          }
        } else {
          const key = props.mode! as string
          return {
            [line[key]]: true
          }
        }
      }
    }

    return {
      render: () => <div style={{  }}>
        <div {...publicProps.value}>
          {
            slots.default.isExist() ? slots.default() : <p>{props.title}</p>
          }
        </div>
      </div>
    }
  }
})


export default SaTitle