import { PropType, reactive } from "vue";

import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaTabs.scss'
import { useModel, useCollect } from "../../hooks";
import SaTabPane from "../SaTabPane/SaTabPane";
import { onMounted } from "vue";
import { computed } from "vue";

enum SaTabType {
  Default = 'default',
  Card = 'card',
  CorderCard = 'border-card'
}

export const SaTabs = designComponent({
  name: 'sa-tabs',

  props: {
    modelValue: {},
    type: { type: String as PropType<SaTabType>, default: SaTabType.Default }
  },

  emits: {
    onChange: (val: any) => true,
  },

  slots: ['default'],
  setup({ props, slots, event: { emit } }) {

    const state = reactive({
      paneMap: new Map()
    })

    const child = SaTabsCollect.parent()

    const model = useModel(() => props.modelValue, emit.onChange)

    const curPanContent = computed(() => state.paneMap.get(model.value) || (() => null))

    const methods = {}

    const handler = {
      handleActive: (val: any) => {
        model.value = val
      }
    }

    onMounted(() => {
      child.forEach((c: any) => state.paneMap.set(c.paneKey, c._.slots.default))
    })
    

    return {
      refer: {
        handler,
        model
      },
      render: () => (
        <div class="sa-tabs">
          <div class="sa-tabs-nav">
            { slots.default.isExist() && slots.default() }
          </div>
          <div class="sa-pane-content">
            { curPanContent.value() }
          </div>
        </div>
      )
    }
  }
})

export const SaTabsCollect = useCollect(() => ({
  parent: SaTabs,
  child: SaTabPane
}))

export default SaTabs


