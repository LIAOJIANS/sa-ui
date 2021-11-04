import { defineComponent, ref } from "vue";
import { SaPopper } from 'sa-ui'


export default defineComponent({
  setup() {

    const box = ref(null)

    return () => <div>
      <SaPopper
        message="我是我啊"
        title="你是你啊"
      >
      </SaPopper>
    </div>
  }
})