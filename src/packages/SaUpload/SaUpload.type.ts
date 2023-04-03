
export type FileUploadStatus = 'ready' | 'uploading' | 'success' | 'fail'

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
