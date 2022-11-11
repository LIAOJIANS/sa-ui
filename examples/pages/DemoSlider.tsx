import { defineComponent, reactive } from "vue";
import { SaSlider } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      slider: 10,
      slider1: 0,

    })
    
    return () => <div>
      <SaSlider 
        v-model={ state.slider }
      />

      { state.slider }

      <SaSlider 
        v-model={ state.slider1 }
        setp={ 10 }
      />
    </div>
  }
})