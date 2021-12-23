// @ts-nocheck

import { defineComponent, reactive } from "vue";
import { SaTooltip, SaButton } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      showTooltip: false
    })
    return () => <>
      <SaTooltip tooltip={'tooltip文本'} placement="bottom">
        <span>普通文本一定要用节点包裹</span>
      </SaTooltip>

      <SaTooltip tooltip={'tooltip文本'}>
        <SaButton>按钮</SaButton>
      </SaTooltip>

      <SaTooltip tooltip="Tooltip文本" theme="dark">
        <span>DARK</span>
      </SaTooltip>
      <SaTooltip tooltip="Tooltip文本" theme="light">
        <span>LIGHT</span>
      </SaTooltip>

      <SaTooltip tooltip='111111111111111111111111111111111111111111111111111111111111' width={100}>
      111111111111111111111111111111111111111111111111111111111111
      </SaTooltip>
    </>
  }
})