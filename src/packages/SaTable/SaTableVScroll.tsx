import { designComponent } from "src/advancedComponentionsApi/designComponent";

import SaScroll from '../SaScroll/SaScroll'
export const SaTbaleVScroll = designComponent({
  name: 'sa-table-v-scroll',

  slots: ['default'],

  emits: {
    onScroll: (e: Event) => true
  },

  setup({ slots, event: { emit } }) {


    return {
      render: () => <div style={{ width: 'calc(100%)' }}>
        <SaScroll
          scrollX
          scrollY
          horizontalScrollbarTooltip="推荐【表头使用鼠标滚轮】，或者【表体Alt键+鼠标滚轮】横向滚动"
          onScroll={ emit.onScroll }
        >
          { slots.default() }
        </SaScroll>
      </div>
    }
  }
})

export default SaTbaleVScroll