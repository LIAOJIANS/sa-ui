import { SaUpload, SaButton, SaIcon } from 'sa-ui'
import { defineComponent, reactive } from 'vue'
import './scss/DemoUpload.scss'

export default defineComponent({
  setup() {

    const state = reactive({
      fileList: [{
        name: "logo.png",
        uid: 1680769149990,
        url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
      }]
    })

    return () => (
      <div>
        <p>File List</p>
        <SaUpload
          action="https://jsonplaceholder.typicode.com/posts/"
          class="upload-demo"
          multiple
          v-slots={{ uploadLoad: ({ click }: { click: any }) => <SaButton label="上传" onClick={click} /> }}
        >
          {/* <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> */}
        </SaUpload>

        <p>img List</p>
        <SaUpload
          multiple
          listType="image"
          action="https://jsonplaceholder.typicode.com/posts/"
          fileList={state.fileList}
          beforeRomve={ (file: any) => file.name="111" }
          v-slots={{ tip: () => (
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          ) }}
        >
        </SaUpload>

        <p>img Card List</p>
        <SaUpload
          class="upload-demo"
          multiple
          listType="image-card"
          v-slots={{ 
            uploadLoad: ({ click }: { click: any }) => <SaButton label="上传" onClick={click} />,
            tip: () => (
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            )
          }}
          fileList={state.fileList}
        >
          <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </SaUpload>

        
        <p>Drag Upload</p>

        <SaUpload
          action="https://jsonplaceholder.typicode.com/posts/"
          class="upload-demo"
          drag
          v-slots={{ tip: () => (
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          ) }}
        > 
          <SaIcon class="sa-icon-upload" icon="el-icon-upload" size={ 67 } />
          <div class="sa-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </SaUpload>
      </div>
    )
  }
})