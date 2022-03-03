import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaMessage.scss'
import { classname, nextIndex } from "src/hooks";
import { computed, PropType } from "vue";
import { MessageServiceFormatOption } from "./index";
import SaIcon from "../SaIcon/SaIcon";

export const SaMessage = designComponent({
  name: 'sa-message',

  props: {
    option: { type: Object as PropType<MessageServiceFormatOption>, required: true }
  },

  emits: {
    onClose: () => true
  },

  setup({ props, event: { emit } }) {

    const classes = computed(() => classname([
      'sa-message',
      `sa-message-status-${props.option.status}`
    ]))

    const styles = { zIndex: nextIndex() }


    const handler = {
      close: () => {
        emit.onClose()
        props.option.onClose && props.option.onClose()
      },

      click: (e: MouseEvent) => {
        !!props.option.onClick && props.option.onClick(e)
      },

      onMouseenter: () => {
        if (!!closeTimer) {
          clearTimeout(closeTimer)
        }
      },
      onMouseleave: () => {
        !!props.option.distance && (closeTimer = setTimeout(handler.close, props.option.distance) as any)
      }
    }

    props.option.close = handler.close

    let closeTimer: number | null = null
    !!props.option.distance && (closeTimer = setTimeout(handler.close, props.option.distance) as any)

    return {
      render: () => <div
        class={classes.value}
        style={styles}
        onClick={handler.click}
        onMouseenter={handler.onMouseenter}
        onMouseleave={handler.onMouseleave}
      >
        {props.option.icon && <SaIcon icon={props.option.icon} />}
        <div class="sa-message-content">{!!props.option.render ? props.option.render() : props.option.message}</div>
        <div class="sa-message-close">
          <SaIcon icon="el-icon-close" onClick={() => handler.close} />
        </div>
      </div>
    }
  }
})

export default SaMessage