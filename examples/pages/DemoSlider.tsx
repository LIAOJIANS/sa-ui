import { defineComponent, reactive } from "vue";
import { SaIcon, SaSlider } from 'sa-ui'
import DemoContainer from '../components/container'

export default defineComponent({
  setup() {

    const state = reactive({
      slider: 10,

      initTimeText1: `
        const state = reactive({
          slider: 10,
        })

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
      `,

      slider1: 0,

      initTimeText2: `
        const state = reactive({
          slider1: 0,
        })

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
      `,
    })
    
    return () => <div>
      <h1 style={{ color: '#333' }}>Slider 滑块</h1>
      <span style={{ color: '#666', fontSize: '14px' }}>通过拖动滑块在一个固定区间内进行选择</span>

      <DemoContainer
        label="基础用法"
        describe="在拖动滑块时，显示当前值"
        codeText={state.initTimeText1}
      >
        {/* @ts-ignore */}
        <div slot="title">
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
        </div>
      </DemoContainer>

      <DemoContainer
        label="高阶自定义用法"
        describe="可以根据自身需求自定义滑块"
        codeText={state.initTimeText2}
      >
        {/* @ts-ignore */}
        <div slot="title">
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
      </DemoContainer>

      

     
    </div>
  }
})