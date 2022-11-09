import { defineComponent, reactive } from "vue";
import { SaSlider } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      slider: 10
    })
    
    return () => <div>
      <SaSlider 
        v-model={ state.slider }
      />
    </div>
  }
})