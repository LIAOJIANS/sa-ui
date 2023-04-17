import { decopy } from "js-hodgepodge";
import { computed, reactive } from "vue";
import upload from "../ajax.util";
import { UploadInternalFileDetail, UploadInternalRawFile, FileUploadStatus, RequestError, UploadProgress } from "../SaUpload.type";

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
    onProgress: (e: UploadProgress, rowFile: UploadInternalFileDetail) => void,
    onSuccess: (res: XMLHttpRequest, rowFile: UploadInternalFileDetail, fileList: UploadInternalFileDetail[]) => void,
    onError: (e: RequestError, rowFile: UploadInternalFileDetail) => void,
    onChange: (file: UploadInternalFileDetail, fileList: UploadInternalFileDetail[]) => void,
    onExceed: (file: FileList, fileList: UploadInternalFileDetail[]) => void,
    httpRequest: (option: any) => void
  }
) {

  const state = reactive({
    fileList: decopy(props.fileList) || [],
    tempIndex: 0,
    reqs: {}
  } as { fileList: UploadInternalFileDetail[], tempIndex: number, reqs: { [k in string]: XMLHttpRequest | null | void } })

  const methods = {
    uploadFiles(files: FileList) {
      if (props.limit && state.fileList.length + files.length > props.limit) { // 超过设置的上传个数
        props.onExceed(files, state.fileList)
        return
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

    uploadAjax(rawFile: UploadInternalFileDetail) {
      const { uid } = rawFile

      const {
        action,
        name,
        headers,
        withCredentials,
        data,

        httpRequest
      } = props

      const config = {
        action,
        filename: name,
        headers,
        withCredentials,
        data,
        file: rawFile.raw,

        onProgress: (e: UploadProgress) => handler.handleProgress(e, rawFile),

        onError: (e: RequestError) => {
          handler.handleError(e, rawFile)
          delete state.reqs[uid]
        },

        onSuccess: (res: XMLHttpRequest) => {
          handler.handleSuccess(res, rawFile)
          delete state.reqs[uid]
        }
      }

      const req = httpRequest ? httpRequest(config) : upload(config)
      state.reqs[uid] = req
      if(
        req &&
        // @ts-ignore
        req.then
      ) {
        req
          // @ts-ignore
          .then(
            config.onSuccess, 
            config.onError
          )
      }

    },

    createUid: () => Date.now() + state.tempIndex++,

    setFileAttr(
      file: UploadInternalFileDetail, 
      attr: { [K in keyof UploadInternalFileDetail]?: UploadInternalFileDetail[K] },

      getter?: (file: UploadInternalFileDetail) => void
    ) {

      if(!file) {
        return file
      }

      state
        .fileList
        .forEach((f, i) => {

        if(f.uid === file.uid) {
          state.fileList[i] = {
            ...f,
            ...attr
          }
        }
      })

      getter?.(decopy({
        ...file,
        ...attr
      }) as UploadInternalFileDetail)
    },

    getFile: (file: UploadInternalFileDetail) => state.fileList.find(f => f.uid === file.uid)
  }

  const handler = {
    handleStart(file: UploadInternalRawFile) {

      const row: UploadInternalFileDetail = {
        name: file.name,
        status: FileUploadStatus.ready,
        size: file.size,
        percentage: 0,
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

      methods.uploadAjax(row)
    },

    handleProgress(e: UploadProgress, rawFile: UploadInternalFileDetail) {
      
      const file = methods.getFile(rawFile)

      methods
        .setFileAttr(
          rawFile, 
          {
            status: FileUploadStatus.uploading,
            percentage: e.percent
          }
        )
      
      props
        .onProgress?.(e, file!)
    },

    handleError(e: RequestError, rawFile: UploadInternalFileDetail) {
      const file = methods.getFile(rawFile)
      
      methods
        .setFileAttr(
          rawFile, 
          {
            status: FileUploadStatus.fail,
          }
        )
      
      props
        .onError?.(e, file!)
      
      props
        .onChange?.(file!, state.fileList)
    },

    handleSuccess(res: XMLHttpRequest, rawFile: UploadInternalFileDetail) {
      const file = methods.getFile(rawFile)

      if(!file) {
        return
      }

      methods
        .setFileAttr(
          rawFile, 
          {
            status: FileUploadStatus.success,
            response: res
          }
        )
      
      props
        .onSuccess?.(res, file, state.fileList)

      props
        .onChange?.(file, state.fileList)
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