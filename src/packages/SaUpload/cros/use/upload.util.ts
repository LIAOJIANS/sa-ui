import { PropType } from "vue";
import { FileListType, UploadInternalFileDetail } from "../SaUpload.type";

export const UploadProp = {
  accept: { type: String, default: '*' },                                               // 限制文件上传类型
  multiple: { type: Boolean },                                                          // 是否多文件上传
  showFileList: { type: Boolean, default: true },                                       // 是否显示上传文件列表
  limit: { type: Number },                                                              // 限制上传个数
  listType: { type: String as PropType<keyof typeof FileListType>, default: 'list' },   // 文件列表展示类型
  fileList: { type: Array as PropType<UploadInternalFileDetail[]> },                    // 文件列表默认回显数组
  headers: { type: Object },                                                            // 上传文件携带的请求头
  action: { type: String },                                                             // 直接上传文件地址
  name: { type: String },                                                               // 定义上传文件名
  data: { type: Object },                                                               // 上传文件请求Body
  withCredentials: { type: Boolean },                                                   // 支持发送 cookie 凭证信息
  drag: { type: Boolean },                                                              // 拖拽上传

  beforeRomve: { type: Function },                                                      // 删除前的回调
  onReomve: { type: Function },                                                         // 删除回调
  onStart: { type: Function },                                                          // 开始上传时回调
  onProgress: { type: Function },                                                       // 上传中的回调
  onSuccess: { type: Function },                                                        // 上传成功回调
  onError: { type: Function },                                                          // 上传失败回调
  onExceed: { type: Function },                                                         // 上传超出上限的钩子
  httpRequest: { type: Function },                                                      // 阻止默认上传逻辑，可以自定义上传方式
  clikcFileItem: { type: Function }                                                     // 点击文件列表时的钩子
}