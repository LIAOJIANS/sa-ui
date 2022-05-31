import { defineComponent, reactive } from "vue";

// @ts-ignore
import { SaButton, SaDialog } from 'sa-ui'


export default defineComponent({
  setup() {

    const state = reactive({
      showDialog: false
    })

    return () => <div>
      <SaButton onClick={ () => state.showDialog = true }> 点我开启弹窗 </SaButton>

      <SaDialog 
        v-model={ state.showDialog }
      />
    </div>
  }
})