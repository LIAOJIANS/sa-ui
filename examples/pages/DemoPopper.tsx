import { defineComponent } from "vue";
import { SaPopper } from 'sa-ui'


export default defineComponent({
  setup() {


    return () => <SaPopper
    >
      <div>
        我是弹窗啊
      </div>
    </SaPopper>
  }
})