import { defineComponent, reactive } from "vue";
import { SaIcon, SaSlider } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      slider: 10,
      slider1: 0
    })
    
    return () => <div>
      <SaSlider 
        v-model={ state.slider }
        max={ 50 }
        marks={
          {
            10: () => <div> <SaIcon icon="el-icon-alarm-clock" /> </div>,
            20: () => <div style={{ fontWeight: 'bold', color: '#3C64A0' }}> 20% </div>
          }
        }
      />

      { state.slider } / 50

      <SaSlider 
        v-model={ state.slider1 }
        setp={ 10 }
        
        marks={
          {
            10: () => <div> <SaIcon icon="el-icon-alarm-clock" /> </div>,
            20: () => <div style={{ fontWeight: 'bold', color: '#3C64A0' }}> 20% </div>
          }
        }
      />
    </div>
  }
})