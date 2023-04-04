import { SaUpload, SaButton } from 'sa-ui'
import { defineComponent } from 'vue'
import './scss/DemoUpload.scss'

export default defineComponent({
  setup() {


    return () => (
      <SaUpload 
        class="upload-demo"
        multiple
        v-slots={{ uploadLoad: ({ click }: { click: any }) => <SaButton label="上传" onClick={ click } /> }} 
      >
        <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </SaUpload>
    )
  }
})