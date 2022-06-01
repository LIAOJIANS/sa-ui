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
        title="测试dialog"
        v-model={ state.showDialog }
        confirmButton
        cancelButton
        scroll
        max-height="500px"
        width="800px"
      >
        <div >
          { new Array(12).fill('text').map(c => <p style={{ height: '30px', }}>{ c }</p>) }
        </div>
      </SaDialog>
    </div>
  }
})