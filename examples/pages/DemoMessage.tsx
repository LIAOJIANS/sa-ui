// @ts-nocheck

import { defineComponent } from "vue";
import { SaButton, useMessage } from 'sa-ui'

export default defineComponent({
  setup() {

    const $message = useMessage()
    return () => <div>
      <SaButton onClick={() => {
        $message.success('提示信息！')
      }
      }>点我弹出基本Message框</SaButton>
      
    </div>
  }
})