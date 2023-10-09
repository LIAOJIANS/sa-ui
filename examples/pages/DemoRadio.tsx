import { defineComponent, reactive } from "vue";
import { SaRadio, SaRadioGroup } from 'sa-ui'
import DemoContainer from '../components/container'

export default defineComponent({
  setup() {

    const state = reactive({
      singlStatus: 2,
      initTimeText1: `
        const state = reactive({
          singlStatus: 2,
        })

        <SaRadio v-model={ state.singlStatus } trueValue={ 1 } > 我是单个单选框 </SaRadio>
        <SaRadio v-model={ state.singlStatus } label='我是单个单选框2' trueValue={ 2 } ></SaRadio>
      `,

      groupStatus: 'shanghai',
      initTimeText2: `
        const state = reactive({
          groupStatus: 'shanghai',
        })


        <SaRadioGroup v-model={ state.groupStatus } >
          <SaRadio label="广州" value="guangzhou" />
          <SaRadio label="深圳" value="shenzhen" />
          <SaRadio label="上海" value="shanghai" />
          <SaRadio label="北京" value="beijing" />
          <SaRadio label="杭州" value="hangzhou" />
        </SaRadioGroup>
      `
    })
    return () => <div>
      
      <h1 style={{ color: '#333' }}>Radio 单选框</h1>
      <span style={{ color: '#666', fontSize: '14px' }}>在一组备选项中进行单选</span>

      <DemoContainer
        label="基础用法"
        describe="由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。"
        codeText={state.initTimeText1}
      >
        {/* @ts-ignore */}
        <div slot="title">
          <SaRadio v-model={ state.singlStatus } trueValue={ 1 } > 我是单个单选框 </SaRadio>
          <SaRadio v-model={ state.singlStatus } label='我是单个单选框2' trueValue={ 2 } ></SaRadio>
        </div>
      </DemoContainer>

      <DemoContainer
        label="Radio 组"
        describe="适用于在多个互斥的选项中选择的场景"
        codeText={state.initTimeText1}
      >
        {/* @ts-ignore */}
        <div slot="title">
          <SaRadioGroup v-model={ state.groupStatus } >
            <SaRadio label="广州" value="guangzhou" />
            <SaRadio label="深圳" value="shenzhen" />
            <SaRadio label="上海" value="shanghai" />
            <SaRadio label="北京" value="beijing" />
            <SaRadio label="杭州" value="hangzhou" />
          </SaRadioGroup>
        </div>
      </DemoContainer>

    </div>
  }
})