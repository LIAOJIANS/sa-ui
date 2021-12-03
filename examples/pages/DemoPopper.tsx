import { defineComponent, handleError, ref } from "vue";
import { SaPopper } from 'sa-ui'


export default defineComponent({
  setup() {

    const popperState = ref(false)

    const handler = {
      showPopper: () => {
        
        popperState.value = true
      }
    }

    return () => <div>
      <SaPopper
        v-model={ popperState.value }
        message="我是我啊"
        title="你是你啊"
      >
        
      <button>hover激活</button>
      </SaPopper>

      <button onClick={ handler.showPopper }>点我展开</button>
    </div>
  }
})