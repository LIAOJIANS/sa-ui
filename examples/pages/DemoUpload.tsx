import { SaUpload, SaButton, SaIcon } from 'sa-ui'
import { defineComponent, reactive } from 'vue'
import './scss/DemoUpload.scss'
import DemoContainer from '../components/container'

export default defineComponent({
  setup() {

    const state = reactive({
      fileList: [{
        name: "logo.png",
        uid: 1680769149990,
        url: "http://saui.liaojs.cn/logo.ico"
      }],

      initTimeText1: `
        <SaUpload
          action="http://saui.liaojs.cn"
          class="upload-demo"
          multiple
          v-slots={{ uploadLoad: ({ click }: { click: any }) => <SaButton label="上传" onClick={click} /> }}
        >
        </SaUpload>
      `,

      initTimeText2: `
        const state = reactive({
          fileList: [{
            name: "logo.png",
            uid: 1680769149990,
            url: "http://saui.liaojs.cn/logo.ico"
          }],
        })

        <SaUpload
          multiple
          listType="image"
          action="http://saui.liaojs.cn"
          fileList={state.fileList}
          beforeRomve={ (file: any) => file.name="111" }
          v-slots={{ tip: () => (
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          ) }}
        >
        </SaUpload>
      `,

      initTimeText3: `
        const state = reactive({
          fileList: [{
            name: "logo.png",
            uid: 1680769149990,
            url: "http://saui.liaojs.cn/logo.ico"
          }],
        })

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
      `,

      initTimeText4: `
        <SaUpload
          action="http://saui.liaojs.cn"
          class="upload-demo"
          drag
          v-slots={{ tip: () => (
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          ) }}
        > 
          <SaIcon class="sa-icon-upload" icon="el-icon-upload" size={ 67 } />
          <div class="sa-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </SaUpload>
      `
    })

    return () => (
      <div>

        <h1 style={{ color: '#333' }}>Upload 上传</h1>
        <span style={{ color: '#666', fontSize: '14px' }}>通过点击或者拖拽上传文件</span>

        <DemoContainer
          label="基础文件列表"
          describe="显示上传之后的文件名称组成的列表"
          codeText={state.initTimeText1}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaUpload
              action="http://saui.liaojs.cn"
              class="upload-demo"
              multiple
              v-slots={{ uploadLoad: ({ click }: { click: any }) => <SaButton label="上传" onClick={click} /> }}
            >
              {/* <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> */}
            </SaUpload>
          </div>
        </DemoContainer>

        <DemoContainer
          label="照片墙"
          describe="使用 list-type 属性来设置文件列表的样式。"
          codeText={state.initTimeText2}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaUpload
              multiple
              listType="image"
              action="http://saui.liaojs.cn"
              fileList={state.fileList}
              beforeRomve={ (file: any) => file.name="111" }
              v-slots={{ tip: () => (
                <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              ) }}
            >
            </SaUpload>
          </div>
        </DemoContainer>

        <DemoContainer
          label="基础图片文件列表"
          describe="显示上传之后的图片、文件名称组成的列表"
          codeText={state.initTimeText3}
        >
          {/* @ts-ignore */}
          <div slot="title">
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
          </div>
        </DemoContainer>
        
        <DemoContainer
          label="拖拽上传"
          describe="用户拖拽到指定区域上传"
          codeText={state.initTimeText4}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaUpload
              action="http://saui.liaojs.cn"
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
        </DemoContainer>
      </div>
    )
  }
})