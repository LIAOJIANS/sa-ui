import { computed, ref, PropType } from "vue"
import { designComponent } from "../advancedComponentionsApi/designComponent"
import './input.scss'
import {
  classname,
  unit,
  
  StyleProps,

  useStyle,
  useStyles,
  useNumber
} from '../../hooks'


export const SaInput = designComponent({

  props: {
    ...StyleProps,
    textarea: { type: Boolean },
    block: { type: Boolean },

    width: { type: [Number, String] as PropType<string | number>, default: null },
    minHeight: { type: [Number, String], default: 100 },
    maxHeight: { type: [Number, String] as PropType<string | number | null>, default: 156 },
    autoHeight: {type: Boolean}

  },

  name: 'sa-input',
  setup(props, { emit }) {
    // const inputValue = ref('')
    // const inputRef = ref(null as any as HTMLInputElement)

    const model = ref('')

    const { styleComputed } = useStyle({ status: undefined })
    const { numberState } = useNumber(props, ['width', 'minHeight', 'minHeight'])


    const classes = computed(() => classname([
      `sa-input-shape-${styleComputed.value.shape}`,
      `sa-input-size-${styleComputed.value.size}`,
      {
        [`sa-input-status-${styleComputed.value.status}`]: !!styleComputed.value.status,
      }
    ]))

    const styles = useStyles(styles => {
      if(!numberState.width && !props.block) {
        styles.width = unit(numberState.width)
      }

      // if(!!props.textarea) {
      //   if(!props.autoHeight) {
      //     styles.height = unit('100')
      //   } else {

      //   }
      // }

      return styles
    })


    const publicProps = computed(() => ({
      style: styles.value,
      value: model.value || ''
    }) as any)


    const methods = {

    }



    return {

      refer: {
        methods
      },
      render: () => {

        if (props.textarea) {

          return (
            <div class={'sa-textarea ' + classes.value}>
              <textarea class='sa-textarea-inner' { ...publicProps.value }></textarea>
            </div>
          )

        } else {
          return (
            <div class={'sa-input ' + classes.value}>
              <input class="sa-input-inner" { ...publicProps.value } />
            </div>
          )
        }
      }
    }
  }
})


export default SaInput