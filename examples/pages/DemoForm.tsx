import { defineComponent } from "vue";

// @ts-ignore
import { SaForm, SaFormItem } from 'sa-ui'
import { SaInput } from "src/packages";

export default defineComponent({
  setup() {
    return () => <div>
      <SaForm 
        width={ 700 }
        labelWidth={ 120 }
        column={ 1 }
        contentWidth={ 300 }
      >
        <SaFormItem label="111">
          <SaInput  style={{ width: '200px' }} />
        </SaFormItem>

        <SaFormItem label="hello2">
          <SaInput />
        </SaFormItem>

        <SaFormItem label="hello3">
          <SaInput />
        </SaFormItem>
      </SaForm>
    </div>
  }
})