import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { delay, useRefList } from "src/hooks";
import { reactive } from "vue";
import { MessageServiceDirection } from ".";
import SaMessageContainer from './SaMessageContainer'

export const SaMessageManager = designComponent({
  name: 'SaMessageManager',

  props: {
    name: { required: true },
    Component: { required: true },
  },

  setup({ props }) {
    const state = reactive({
      containers: [
        {
          horizontal: MessageServiceDirection.center, // 初始横向默认位置
          vertical: MessageServiceDirection.start, // 初始纵向默认位置
        }
      ] as { horizontal: MessageServiceDirection, vertical: MessageServiceDirection }[]
    })

    const { refList, onRefList } = useRefList(SaMessageContainer)

    const getContainer = async (config: {
      horizontal: MessageServiceDirection,
      vertical: MessageServiceDirection
    }): Promise<typeof SaMessageContainer.use.class> => {
      for (let i = 0; i < refList.length; i++) {
        const ref = refList[i];
        if (ref.props.horizontal === config.horizontal && ref.props.vertical === config.vertical) {
          return ref
        }
      }
      state.containers.push(config);
      await delay(0)
      return getContainer(config)
    }

    return {
      refer: {
        props,
        getContainer
      },
      render: () => <div class="sa-message-manager">
        {
          state.containers.map((container, index) => (
            <SaMessageContainer
              horizontal={container.horizontal}
              vertical={container.vertical}
              ref={onRefList(index)}
              key={index}
            />
          ))
        }
      </div>
    }
  }
})
