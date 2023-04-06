import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, PropType, reactive } from "vue";
import SaIcon from "../SaIcon/SaIcon";
import { FileListType, FileUploadStatus, UploadInternalFileDetail } from "./cros/SaUpload.type";
import { UploadProp } from "./cros/use/upload.util";
import SaUpload from './Saupload'

const SaUploadList = designComponent({

  name: 'sa-upload-list',

  props: {
    ...UploadProp,
    fileList: { type: Array as PropType<UploadInternalFileDetail[]>, default: [] }
  },

  setup({ props }) {

    const parent = SaUpload.use.inject()

    const state = reactive({
      mouseIndex: -1
    })

    const iconStatus = computed(() => (status: FileUploadStatus) => ({
      [FileUploadStatus.ready]: '',
      [FileUploadStatus.fail]: 'error',
      [FileUploadStatus.success]: 'success',
      [FileUploadStatus.uploading]: '',
    }[status]))

    const icon = computed(() => (status: FileUploadStatus, percentage: number, index: number) => {

      if (
        status === FileUploadStatus.success &&
        percentage === 100 &&
        index === state.mouseIndex
      ) {
        return 'el-icon-close'
      }

      if (status === FileUploadStatus.success) {
        return 'el-icon-circle-check'
      }

      if (status === FileUploadStatus.fail) {
        return 'el-icon-circle-close'
      }

    })

    const handler = {
      handleSetCurIndex(index: number, e?: MouseEvent) {
        if (state.mouseIndex === index) {
          return
        }

        e?.stopPropagation()
        e?.preventDefault()

        state.mouseIndex = index
      }
    }

    return {
      render: () => (
        props.listType === FileListType.image ? ( // 实现图片列表
          <div class="sa-upload__img">
            {
              props.fileList.map((file, index) => (
                <div class='sa-upload-file__image' >
                  <img src={file.url} alt="" />
                  <SaIcon size={18} icon='el-icon-close' class="sa-upload__image-close" onClick={() => parent.handler.handleRemove(file)}></SaIcon>
                </div>
              ))
            }

            <div class='sa-upload-file__image' onClick={parent.handler.handleUploadBtn}>
              <SaIcon class="sa-upload-file__image_icon" icon='el-icon-jiahao' size="32" color="#8c939d"></SaIcon>
            </div>
          </div>
        ) : props.listType === FileListType["image-card"] ? (
          <div class='sa-upload-file__iamge-card'>2</div>
        ) : (
          <div class='sa-upload-file'>
            {
              props.fileList.map((file, index) => (
                <div class="sa-upload-file-item" onMouseover={() => handler.handleSetCurIndex(index)} onMouseout={() => handler.handleSetCurIndex(-1)}>
                  <span class="sa-upload__filename"><SaIcon icon='el-icon-document' style="padding-right: 5px"></SaIcon>{file.name}</span>
                  <SaIcon
                    size={14}
                    icon={icon.value(file.status, file.percentage, index)}
                    status={iconStatus.value(file.status)}
                    onClick={() => icon.value(file.status, file.percentage, index) === 'el-icon-close' && parent.handler.handleRemove(file)}
                  ></SaIcon>
                </div>
              ))
            }
          </div>
        )
      )
    }
  }
})

export default SaUploadList