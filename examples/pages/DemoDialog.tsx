import { computed, defineComponent, reactive } from "vue";

// @ts-ignore
import { SaButton, SaDialog } from 'sa-ui'


export default defineComponent({
  setup() {

    const state = reactive({
      showDialog: false,
      loading: true
    })

    const handle = {
      onScroll: (e: Event) => {
        // console.log(e);
      }
    }

   setTimeout(() => state.loading = false, 5000)

    return () => <div>
      <SaButton onClick={ () => state.showDialog = true }> 点我开启弹窗 </SaButton>

      <SaDialog
        title="测试dialog"
        v-model={ state.showDialog }
        confirmButton
        cancelButton
        scroll
        loading={ state.loading }

        max-height="500px"
        width="800px"
        onScroll={ handle.onScroll }
      >
        <div >
          { new Array(12).fill('text').map(c => <p style={{ height: '30px', }}>{ c }</p>) }
        </div>
      </SaDialog>
    </div>
  }
})