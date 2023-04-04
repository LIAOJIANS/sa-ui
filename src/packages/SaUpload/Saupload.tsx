import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { onDeactivated } from "vue";
import './SaUpload.scss'

import { useRefs } from "src/hooks";
import { SaButton } from '../SaButton/SaButton'
import { SimpleFunction } from "src/hooks/utils/event";
import { useUpload } from "./cros/use/useUpload";
import SaUploadList from './SaUploadList'
import { UploadProp } from "./cros/use/upload.util";

const SaUpload = designComponent({
  name: 'Sa-Upload',

  props: UploadProp,

  scopeSlots: {
    uploadLoad: (scope: { click: SimpleFunction }) => {}
  },

  slots: ['default'],

  setup({ props, slots, scopeSlots }) {

    const { state, methods } = useUpload(props as any)

    const { onRef, refs } = useRefs({
      input: HTMLInputElement
    })

    const handle = {
      handleUploadBtn() {
        refs.input?.click()
      },

      handleUploadChange(e: Event) {
        const file = (e.target as HTMLInputElement).files

        if (!file) {
          return
        }
        
        methods.uploadFiles(file)
        
      }
    }

    onDeactivated(() => {
      state
        .fileList
        .forEach(f => {
          if(f.url && f.url.indexOf('blob:') === 0) { // 删除上传图片生成的内存地址，防止浪费内存导致内存溢出
            URL.revokeObjectURL(f.url)
          }
        })
    })
    
    return {

      render: () => (
        <div>
          <input
            ref={onRef.input}
            class="sa-upload__input"
            multiple={props.multiple}
            type="file"
            accept={props.accept}
            onChange={handle.handleUploadChange}
          />

          {
            scopeSlots.uploadLoad.isExist() ? scopeSlots.uploadLoad({
              click: handle.handleUploadBtn
            }) : (
              <SaButton label="上传" onClick={handle.handleUploadBtn} />
            )
          }

          <div class="sa-upload__toolpit">
            { slots.default.isExist() && slots.default() }
          </div>
          {
            state.fileList.length > 0 && <SaUploadList {...{...props, fileList: state.fileList}} />
          }
        </div>
      )
    }
  }
})

export default SaUpload