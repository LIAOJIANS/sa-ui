// @ts-nocheck
import { defineComponent } from "vue";
import { SaRow, SaCol } from 'sa-ui'

export default defineComponent({
  setup() {
    return () => <div>
      <p>基本用法</p>
      <SaRow>
        <SaCol span={8}>1</SaCol>
        <SaCol span={8}>2</SaCol>
        <SaCol span={8}>3</SaCol>
      </SaRow>
      
      <p>item间隔</p>
      <SaRow gut={10}>
        <SaCol span={8}>1</SaCol>
        <SaCol span={8}>2</SaCol>
        <SaCol span={8}>3</SaCol>
      </SaRow>

      <p>flex布局middle垂直居中</p>
      <SaRow type="flex" align="middle">
        <SaCol span={8}>1</SaCol>
        <SaCol span={8}>2</SaCol>
        <SaCol span={8}>3</SaCol>
      </SaRow>
    </div>
  }
})