import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { onDeactivated } from "vue";
import './SaUpload.scss'

import { useRefs } from "src/hooks";
import { SaButton } from '../SaButton/SaButton'
import { SimpleFunction } from "src/hooks/utils/event";
import { useUpload } from "./cros/use/useUpload";
import SaUploadList from './SaUploadList'
import { UploadProp } from "./cros/use/upload.util";
import { FileListType, UploadInternalFileDetail } from "./cros/SaUpload.type";
import { decopy, typeOf } from "js-hodgepodge";

const SaUpload = designComponent({
  name: 'Sa-Upload',

  props: UploadProp,

  scopeSlots: {
    uploadLoad: (scope: { click: SimpleFunction }) => { },
    files: (scope: { files: UploadInternalFileDetail[] }) => { }
  },

  provideRefer: true,

  slots: ['default'],

  setup({ props, slots, scopeSlots }) {

    const { state, methods, handler: uploadHandler } = useUpload(props as any)

    const { onRef, refs } = useRefs({
      input: HTMLInputElement
    })

    const handler = {
      handleUploadBtn() {
        refs.input?.click()
      },

      handleUploadChange(e: Event) {
        const file = (e.target as HTMLInputElement).files

        if (!file) {
          return
        }

        methods.uploadFiles(file)

        // @ts-ignore
        refs.input.value = '' //  清空文件选项，目的是可以同文件多次上传
      },

      handleRemove(
        file: UploadInternalFileDetail, 
        index: number
      ) {
        
        if(props.beforeRomve) { // 删除前
          const flag = props.beforeRomve({...file}, decopy(state.fileList), index)

          if(flag && typeOf(flag) === 'boolean') { // 删除前阻止删除行为，只需返回true
            return
          }
        }

        uploadHandler
          .handleDelete(index)

        props.onReomve?.({...file}, decopy(state.fileList), index)
        
      },

      beforRemove() {
        
      }
    }

    onDeactivated(() => {
      state
        .fileList
        .forEach(f => {
          if (f.url && f.url.indexOf('blob:') === 0) { // 删除上传图片生成的内存地址，防止浪费内存导致内存溢出
            URL.revokeObjectURL(f.url)
          }
        })
    })

    return {

      refer: {
        handler,
        inputInstance: refs
      },
      render: () => (
        <div>
          <input
            ref={onRef.input}
            class="sa-upload__input"
            multiple={props.multiple}
            type="file"
            accept={props.accept}
            onChange={handler.handleUploadChange}
          />

          {
           props.listType !== FileListType.image && scopeSlots.uploadLoad({
              click: handler.handleUploadBtn
            }, <SaButton label="上传" onClick={handler.handleUploadBtn} />)
          }

          <div class="sa-upload__toolpit">
            {slots.default.isExist() && slots.default()}
          </div>

          {
            // state.fileList.length > 0 && (
              scopeSlots.files({ files: state.fileList }, <SaUploadList {...{ ...props, fileList: state.fileList }} />)
            // )
          }
        </div>
      )
    }
  }
})

export default SaUpload