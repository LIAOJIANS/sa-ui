import { PropType } from "vue";
import { FileListType } from "../SaUpload.type";

export const UploadProp = {
  accept: { type: String, default: '*' },
  multiple: { type: Boolean },
  showFileList: { type: Boolean, default: true },
  limit: { type: Number },
  listType: { type: String as PropType<keyof typeof FileListType>, default: 'list' }
}