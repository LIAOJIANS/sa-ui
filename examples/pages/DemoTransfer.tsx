//@ts-nocheck

import { defineComponent } from "vue";
import { SaTransfer } from 'sa-ui'

export default defineComponent({
  setup() {
    return () => <div>
      <SaTransfer 
        btnTexts={ ['1', '2'] }
      />
    </div>
  }
})