// @ts-nocheck

import { defineComponent, reactive } from "vue";
import { SaRadio, SaRadioGroup } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      singlStatus: true,
      groupStatus: 'shanghai'
    })
    return () => <div>
      <p>单个SaRadio</p>
      <SaRadio v-model={ state.singlStatus } trueValue={true} false={ false } > 我是单个单选框 </SaRadio>

      <p>Radio group</p>
      
      <SaRadioGroup v-model={ state.groupStatus } >
        <SaRadio label="广州" value="guangzhou" />
        <SaRadio label="深圳" value="shenzhen" />
        <SaRadio label="上海" value="shanghai" />
        <SaRadio label="北京" value="beijing" />
        <SaRadio label="杭州" value="hangzhou" />
      </SaRadioGroup>

    </div>
  }
})