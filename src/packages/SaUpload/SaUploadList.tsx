import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, PropType, reactive } from "vue";
import SaIcon from "../SaIcon/SaIcon";
import { FileListType, FileUploadStatus, UploadInternalFileDetail } from "./cros/SaUpload.type";
import { UploadProp } from "./cros/use/upload.util";
import SaUpload from './Saupload'
import SaProgress from "../SaProgress/SaProgress";
import { ProgressType } from "../SaProgress/progress.utils";

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

    const icon = computed(() => (
      status: FileUploadStatus,
      percentage: number,
      index: number
    ) => {

      status = status || FileUploadStatus.success // 自定义fileList可能存在没有status的情况
      percentage = percentage || 100

      if (
        status === FileUploadStatus.success &&
        percentage === 100 &&
        index === state.mouseIndex
      ) {
        return 'el-icon-close'
      }

      if (status === FileUploadStatus.success) {
        return props.listType === FileListType["image-card"] ? 'el-icon-check' : 'el-icon-circle-check'
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
      render: () => {
        const iconContent = (file: UploadInternalFileDetail, index: number) => (
          <SaIcon
            size={props.listType === FileListType.list ? 28 : 16}
            icon={icon.value(file.status, file.percentage, index)}
            status={iconStatus.value(file.status)}
            onClick={() =>
              ['el-icon-circle-close', 'el-icon-close'].includes(icon.value(file.status, file.percentage, index)!) &&
              parent.handler.handleRemove(file, index)
            }
          ></SaIcon>
        )

        const progressContent = (file: UploadInternalFileDetail) => (
          <SaProgress
            class={props.listType === FileListType.image ? 'sa-upload-image__progress' : 'sa-upload__progress'}
            type={props.listType === FileListType.image ? ProgressType.Circle : ProgressType.Line}
            percentage={file.percentage}
            width={props.listType === FileListType.image ? 6 : 2}
          />
        )

        return (

          props.listType === FileListType.image ? ( // 实现图片列表
            <div class="sa-upload__img">
              {
                props.fileList.map((file, index) => (
                  <div class='sa-upload-file__image' onClick={() => props.clikcFileItem?.(file, index, props.fileList)} >
                    <img src={file.url} alt="" />
                    <SaIcon size={18} icon='el-icon-close' class="sa-upload__image-close" onClick={() => parent.handler.handleRemove(file, index)}></SaIcon>
                    {file.status === FileUploadStatus.uploading && progressContent(file)}
                    {file.status === FileUploadStatus.uploading && (<div class="sa-upload__image-mask"></div>)}
                  </div>
                ))
              }
              <div class='sa-upload-file__image' onClick={parent.handler.handleUploadBtn}>
                <SaIcon class="sa-upload-file__image_icon" icon='el-icon-jiahao' size="32" color="#8c939d"></SaIcon>
              </div>
            </div>
          ) : props.listType === FileListType["image-card"] ? (
            <div class='sa-upload-file__iamge-card'>
              {
                props.fileList.map((file, index) => (
                  <div class="sa-upload__ccontent" onClick={() => props.clikcFileItem?.(file, index, props.fileList)} >
                    <div class="sa-upload__card" onMouseover={() => handler.handleSetCurIndex(index)} onMouseout={() => handler.handleSetCurIndex(-1)}>
                      <img src={file.url} alt="" />
                      <span>{file.name}</span>
                      <i class="sa-upload__card-icon" >
                        {iconContent(file, index)}
                      </i>
                    </div>
                    {file.status === FileUploadStatus.uploading && progressContent(file)}
                  </div>
                ))
              }
            </div>
          ) : (
            <div class='sa-upload-file'>
              {
                props.fileList.map((file, index) => (
                  <>
                    <div
                      class="sa-upload-file-item"
                      onClick={() => props.clikcFileItem?.(file, index, props.fileList)}
                      onMouseover={() => handler.handleSetCurIndex(index)}
                      onMouseout={() => handler.handleSetCurIndex(-1)}
                    >
                      <span class="sa-upload__filename"><SaIcon icon='el-icon-document' style="padding-right: 5px"></SaIcon>{file.name}</span>
                      {iconContent(file, index)}
                    </div>
                    {file.status === FileUploadStatus.uploading && progressContent(file)}
                  </>
                ))
              }
            </div>
          )
        )
      }
    }
  }
})

export default SaUploadList