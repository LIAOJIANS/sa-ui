// @ts-nocheck

import { defineComponent } from "vue";
import { SaMessage } from 'sa-ui'

export default defineComponent({
  setup() {
    return () => <div>
      <SaMessage 
        option={{
          message: '我是message',
          status: 'success'
        }}
      />
    </div>
  }
})