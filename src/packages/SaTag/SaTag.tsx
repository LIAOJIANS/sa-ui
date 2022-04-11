import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, DEFAULT_STATUS, StyleProps, useStyle, useStyles } from "src/hooks";
import { computed } from "vue";
import SaIcon from "../SaIcon/SaIcon";
import './SaTag.scss'


export const SaTag = designComponent({

  name: 'sa-tag',

  props: {
    status: { ...StyleProps.status},
    style: { ...StyleProps.style},
    plain: { type: Boolean, default: false },
    closeIcon: { type: Boolean, default: false },
    disableTransitions: { type: Boolean, default: false }
  },

  slots: [ 'default' ],

  emits: {
    onClose: (e: MouseEvent) => true,
    onClick: (e: MouseEvent) => true
  },

  setup({ props, slots, event: { emit } }) {

    const { styleComputed } = useStyle({ status: DEFAULT_STATUS })

    const classes = computed(() => classname([
      'sa-tag',
      `sa-tag-status-${styleComputed.value.status}`,
      {
        'sa-tag-transitions': !props.disableTransitions,
      }
    ]))

    const contentClasses = computed(() => classname([
      'sa-tag-content',
      `sa-tag-${!!props.plain ? 'no-plain' : 'plain'}`,
    ]))

    const iconStyles = useStyles( style => {
      style.marginLeft = '5px'

      return style
    })


    const handler = {
      close: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        emit.onClose(e)
      },

      click: (e: MouseEvent) => {
        emit.onClick(e)
      }
    }

    return {
      render: () => <div
        class={ classes.value }
        style={ props.style as any }
        onClick={ handler.click }
      >
        <span class={ contentClasses.value }>
          { slots.default() }
          <SaIcon 
            class="sa-tag-close-icon" 
            icon="el-icon-close" 
            size="12" 
            style={ iconStyles.value }
            onClick={ handler.close }
          />
        </span>

      </div>
    }
  }
})


export default SaTag