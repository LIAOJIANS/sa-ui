import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaUpload.scss'

import { useRefs } from "src/hooks";
import { SaButton } from '../SaButton/SaButton'
import { reactive } from "vue";
import { SimpleFunction } from "src/hooks/utils/event";

const SaUpload = designComponent({
  name: 'Sa-Upload',

  props: {
    accept: { type: String, default: '*' },
    multiple: { type: Boolean },
    showFileList: { type: Boolean, default: true },
    limit: { type: Number }
  },

  scopeSlots: {
    default: (scope: { click: SimpleFunction }) => {}
  },

  setup({ props, slots, scopeSlots }) {

    const state = reactive({
      fileList: null
    } as { fileList: FileList | null })

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

        

        state.fileList = file
        console.log(state.fileList);
      }
    }

    // console.log(slots.default());
    

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
            scopeSlots.default.isExist() ? scopeSlots.default({
              click: handle.handleUploadBtn
            }) : (
              <SaButton label="上传" onClick={handle.handleUploadBtn} />
            )
          }

          {/* {
            state.fileList!.length > 0 && (
              state.fileList!.map(file => (
                // <span>{ file.name }</span>
                1
              ))
            )
          } */}
        </div>
      )
    }
  }
})

export default SaUpload