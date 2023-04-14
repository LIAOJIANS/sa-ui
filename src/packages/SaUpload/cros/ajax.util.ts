import { typeOf } from "js-hodgepodge";
import { RequestError, RequestMethods, UploadInternalRawFile } from "./SaUpload.type";

function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response

  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

function getError(
  action: string,
  xhr: XMLHttpRequest
) {
  let msg
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }

  const err: RequestError = new Error(msg);
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}


export default function upload({
  action,
  data,
  filename,
  file,
  headers,
  withCredentials,

  onProgress,
  onError,
  onSuccess
}: {
  action: string,
  withCredentials: boolean,
  headers: Record<string, string>,
  file: UploadInternalRawFile,
  filename: string,
  data: Record<string, any>,

  onProgress: (e: ProgressEvent<EventTarget>) => void,
  onError: (e: RequestError) => void,
  onSuccess: (e: any) => void,
}) {
  if (!XMLHttpRequest && typeOf(XMLHttpRequest) === 'undefined') {
    return null
  }

  // debugger

  const xhr = new XMLHttpRequest()

  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        // @ts-ignore
        e.percent = e.loaded / e.total * 100
      }
      onProgress(e)
    }
  }

  const formData = new FormData()

  if (data) {
    Object
      .entries(([k, v]: any[]) => formData.append(k, v))
  }

  formData.append(filename, file, file.name)

  xhr.onerror = function error(e: any) {
    onError(e)
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return onError(getError(action, xhr))
    }

    onSuccess(getBody(xhr))
  }

  xhr.open(RequestMethods.post, action, true);

  if (withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const header = headers || {}

  for (let item in header) {
    if (header.hasOwnProperty(item) && header[item] !== null) {
      xhr.setRequestHeader(item, header[item])
    }
  }

  xhr.send(formData)

  return xhr
}