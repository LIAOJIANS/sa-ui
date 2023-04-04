import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname } from "src/hooks";
import { computed, PropType, reactive } from "vue";
import SaIcon from "../SaIcon/SaIcon";
import { FileListType, FileUploadStatus, UploadInternalFileDetail } from "./cros/SaUpload.type";
import { UploadProp } from "./cros/use/upload.util";

const SaUploadList = designComponent({

  name: 'sa-upload-list',

  props: {
    ...UploadProp,
    fileList: { type: Array as PropType<UploadInternalFileDetail[]>, default: [] }
  },

  setup({ props }) {

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

      if(status === FileUploadStatus.success && percentage === 100 && index === state.mouseIndex) {
        return 'el-icon-close'
      }

      if(status === FileUploadStatus.success) {
        return 'el-icon-circle-check'
      }

      if(status === FileUploadStatus.fail) {
        return 'el-icon-circle-close'
      }

    })

    return {
      render: () => (
        props.listType === FileListType.image ? (
          <div>1</div>
        ) : (
          <div class='sa-upload-file'>
            {
              props.fileList.map((file, index) => (
                <div class="sa-upload-file-item" onMouseover={ () => (state.mouseIndex = index) } onMouseout={ () => (state.mouseIndex = -1) }>
                  <span class="sa-upload__filename"><SaIcon icon='el-icon-document'style="padding-right: 5px"></SaIcon>{file.name}</span>
                  <SaIcon size={14} icon={ icon.value(file.status, file.percentage, index) } status={ iconStatus.value(file.status) }></SaIcon>
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