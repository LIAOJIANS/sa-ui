import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname, delay, useRefList } from "src/hooks";
import { computed,reactive } from "vue";
import { MessageServiceFormatOption } from ".";
import SaMessage from "./SaMessage";
import { SaList } from '../SaList/SaList'
import { SaItem } from '../SaItem/SaItem'

export default designComponent({
  name: 'sa-message-container',
  props: {
    horizontal: { type: String, required: true },
    vertical: { type: String, required: true },
    dur: { type: String, default: "30px" },
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
          style={{ padding: props.dur }}
        >
          <SaList direction="top">
          {
            state.options.map((option, index) => (
              <SaItem  key={index}>
                <SaMessage
                option={option}
                ref={onRefList(index)}
                onClose={() => utils.closeMessage(index)}
              />
              </SaItem>
            ))
          }
          </SaList>
        </div>
      )
    }
  }
})