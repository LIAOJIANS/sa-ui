import { decopy } from "js-hodgepodge";
import { computed, reactive, watch } from "vue";
import upload from "../ajax.util";
import { UploadInternalFileDetail, UploadInternalRawFile, FileUploadStatus, RequestError } from "../SaUpload.type";

export function useUpload(
  props: {
    limit: Number | null,
    multiple: Boolean,
    fileList: UploadInternalFileDetail[],
    headers: {},
    action: string,
    name: string,
    data: {},
    withCredentials: boolean,

    onStart: (rowFile: UploadInternalRawFile) => void,
    onProgress: (e: ProgressEvent<EventTarget>, rowFile: UploadInternalRawFile) => void,
    onSuccess: (e: any, rowFile: UploadInternalRawFile) => void,
    onError: (e: RequestError, rowFile: UploadInternalRawFile) => void,
    httpRequest: (option: any) => void
  }
) {

  const state = reactive({
    fileList: decopy(props.fileList) || [],
    tempIndex: 0
  } as { fileList: UploadInternalFileDetail[], tempIndex: number })

  const methods = {
    uploadFiles(files: FileList) {
      if (props.limit && state.fileList.length + files.length > props.limit) { // 超过设置的上传个数

      }

      let postFiles = Array.prototype.slice.call(files)

      if (!props.multiple) {
        postFiles = postFiles.slice(0, 1)
      }

      postFiles.forEach(file => {
        props.onStart?.(file)
        handler.handleStart(file)
      })
    },

    uploadAjax(rawFile: UploadInternalRawFile) {
      // const { uid } = rawFile
      const {
        action,
        name,
        headers,
        withCredentials,
        data,

        onError,
        onProgress,
        onSuccess,
        httpRequest
      } = props

      const config = {
        action,
        filename: name,
        headers,
        withCredentials,
        data,
        file: rawFile,

        onProgress: (e: ProgressEvent<EventTarget>) => onProgress(e, rawFile),
        onError: (e: RequestError) => onError(e, rawFile),
        onSuccess: (e: any) => onSuccess(e, rawFile)
      }

      const res = httpRequest ? httpRequest(config) : upload(config)

      console.log(res);

    },

    createUid: () => Date.now() + state.tempIndex++
  }

  const handler = {
    handleStart(file: UploadInternalRawFile) {

      const row: UploadInternalFileDetail = {
        name: file.name,
        status: FileUploadStatus.ready,
        size: file.size,
        percentage: 100,
        uid: file.uid || methods.createUid(),
        raw: file
      }

      if (file.type.indexOf('image') > -1) { // 图片生成内存URL
        row.url = URL.createObjectURL(file)
      }

      if (props.limit === 1 || !props.multiple) {
        state.fileList = []
      }

      state
        .fileList
        .push(row)

      methods.uploadAjax(file)
    },

    handleDelete(index: number) {
      state.fileList = state.fileList.filter((f, i) => i !== index)
    }
  }

  return {
    state,
    methods,
    handler,
    fileList: computed(() => state.fileList)
  }
}

export function useProgress() {

}