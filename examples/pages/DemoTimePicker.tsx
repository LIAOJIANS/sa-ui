import { defineComponent } from "vue";

// @ts-ignore
import { SaTimePicker } from 'sa-ui'


export default defineComponent({
  setup() {

    return () => <div>
      <SaTimePicker />
    </div>
  }
})