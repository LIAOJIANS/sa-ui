import { defineComponent, reactive, watch } from "vue";

// @ts-ignore
import { SaTimePicker } from 'sa-ui'


export default defineComponent({
  setup() {

    const state = reactive({
      timer: ''
    })

    watch(() => state.timer, val => {
      console.log(val);
      
    })

    return () => <div>
      <SaTimePicker v-model={ state.timer } />
    </div>
  }
})