import { SaUpload, SaButton } from 'sa-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {


    return () => (
      <SaUpload 
        v-slots={{ default: ({ click }: { click: any }) => <SaButton label="上传" onClick={ click } /> }} 
      />
    )
  }
})