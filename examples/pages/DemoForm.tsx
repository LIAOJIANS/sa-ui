import { defineComponent, reactive } from "vue";

// @ts-ignore
import { SaForm, SaFormItem } from 'sa-ui'
import { SaInput } from "src/packages";

export default defineComponent({
  setup() {

    const formData = reactive({
      val1: '',
      val2: '',
      val3: ''
    })

    const rules = {
      val1: [{ required: true, message: '不能为空', trigger: 'blur' }],
      val2: [{ required: true, message: '不能为空', trigger: 'change' }],
      val3: [{ required: true, message: '不能为空', trigger: 'blur' }]
    }

    return () => <div>
      <SaForm
        model={formData}
        width={ 700 }
        labelWidth={ 120 }
        column={ 1 }
        contentWidth={ 300 }
        rules={rules}
      >
        <SaFormItem label="111" prop="val1">
          <SaInput v-model={ formData.val1 } style={{ width: '200px' }} />
        </SaFormItem>

        <SaFormItem label="hello2" prop="val2">
          <SaInput v-model={ formData.val2 }  />
        </SaFormItem>

        <SaFormItem label="hello3" prop="val3">
          <SaInput v-model={ formData.val3 }  />
        </SaFormItem>
      </SaForm>
    </div>
  }
})