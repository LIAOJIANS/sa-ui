import { decopy } from "js-hodgepodge";
import { computed, reactive, watch } from "vue";
import { UploadInternalFileDetail, UploadInternalRawFile, FileUploadStatus } from "../SaUpload.type";

export function useUpload(
  props: {
    limit: Number | null,
    multiple: Boolean,
    fileList: UploadInternalFileDetail[]
  }
) {

  const state = reactive({
    fileList: decopy(props.fileList) || [],
    tempIndex: 0
  } as { fileList: UploadInternalFileDetail[], tempIndex: number })

  const methods = {
    uploadFiles(files: FileList) {
      if(props.limit && state.fileList.length + files.length > props.limit) { // 超过设置的上传个数

      }

      let postFiles = Array.prototype.slice.call(files)

      if(!props.multiple) {
        postFiles = postFiles.slice(0, 1)
      }

      postFiles.forEach(file => handler.handleStart(file))
    },

    createUid: () => Date.now() + state.tempIndex++
  }

  const handler = {
    handleStart(file: UploadInternalRawFile) {

      const row: UploadInternalFileDetail = {
        name: file.name,
        status: FileUploadStatus.success,
        size: file.size,
        percentage: 100,
        uid: file.uid || methods.createUid(),
        raw: file
      }

      if(file.type.indexOf('image') > -1) { // 图片生成内存URL
        row.url = URL.createObjectURL(file)
      }

      if(props.limit === 1 || !props.multiple) {
        state.fileList = []
      }

      state
        .fileList
        .push(row)

        console.log(state
          .fileList);
        
      
    },
  }

  return {
    state,
    methods,
    fileList: computed(() =>  state.fileList)
  }
}

export function useProgress() {

}