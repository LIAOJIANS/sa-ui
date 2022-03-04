import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, delay, useRefList } from "src/hooks";
import { computed, PropType, reactive } from "vue";
import { MessageServiceDirection, MessageServiceFormatOption } from ".";
import SaMessage from "./SaMessage";

export const SaMessageContainer = designComponent({
  name: 'sa-message-container',
  props: {
    horizontal: { type: String as PropType<MessageServiceDirection>, default: 'center', required: true },
    vertical: { type: String as PropType<MessageServiceDirection>, default: 'start', required: true },
    duration: { type: String, default: "30px" },
  },

  setup({ props }) {

    const classes = computed(() => classname([
      'sa-message-container',
      `sa-message-container-${props.horizontal}-${props.vertical}`
    ]))

    const state = reactive({
      options: [] as MessageServiceFormatOption[]
    })

    const { refList, onRefList } = useRefList<{ props: { option: MessageServiceFormatOption } }>()

    const utils = {
      closeMessage: (i: number) => {
        state.options.splice(i, 1)
      }
    }

    return {
      refer: {
        props,
        getMessage: async (option: MessageServiceFormatOption) => {
          state.options.push(option)
          await delay(0)

          const messages = refList.filter(Boolean)
          for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.props.option === option) {
              return message
            }
          }
          return null
        }
      },

      render: () => (
        <div
          class={classes.value}
          style={{ padding: props.duration }}
        >
          {
            state.options.map((option, index) => (
              <SaMessage
                key={index}
                option={option}
                ref={onRefList(index)}
                onClose={() => utils.closeMessage(index)}
              />
            ))
          }
        </div>
      )
    }
  }
})

export default SaMessageContainer