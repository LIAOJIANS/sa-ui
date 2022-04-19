import { defineComponent, reactive } from "vue";

import {
  SaButton,
  SaLoadingMask
  // @ts-ignore
} from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      loading: false
    })

    
    return () => <div>
      <SaButton onClick={() => state.loading = true} label="点我打开遮罩层" />


      <SaLoadingMask v-model={state.loading} message="loading" />
    </div>
  }
})