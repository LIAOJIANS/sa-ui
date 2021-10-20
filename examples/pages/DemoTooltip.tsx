import { defineComponent, reactive } from "vue";
import { SaTooltip } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      showTooltip: false
    })
    return () => (
      <div>
        <SaTooltip
          // v-model={state.showTooltip}
          content="1111"
        >
          aaaa
        </SaTooltip>
      </div>
    )
  }
})