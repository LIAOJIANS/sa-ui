
export enum FileUploadStatus {
  ready = 'ready',
  uploading = 'uploading',
  success = 'success',
  fail = 'fail'
}

export enum FileListType {
  list = 'list',
  image = 'image'
}

export interface UploadInternalRawFile extends File {
  uid: number
}

export interface UploadInternalFileDetail {
  status: FileUploadStatus,
  name: string,
  size: number,
  percentage: number,
  uid: number,
  raw: UploadInternalRawFile,
  url?: string
}
