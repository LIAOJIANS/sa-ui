import { StyleProps } from "src/hooks";

export enum ProgressType {
  Line = 'line',  // 直线条
  Circle = 'circle', // 原型
  Dashboard = 'dashboard'  // 仪表板
}

export const progressProps = {
  percentage: { type: [Number, String], default: 0 },           // 百分比
  type: { type: String, default: ProgressType.Line },           // 进度条类型
  width: { type: [String, Number], default: 4.8 },              // 进度条的宽度，单位 px
  textInside: { type: Boolean },                                // 进度条显示文字内置在进度条内（只在 type=line 时可用）
  status: StyleProps.status,                                    // 进度条状态
  color: { type: String },                                      // 进度条背景颜色
  gradients: { type: Array },                                   // 渐变色  ---- 只作用于line
  gradientsAnimation: { type: Boolean },                        // 是否启用渐变动画  ---- 只作用于line
  contentFormat: { type: Function },                            // 自定义进度条内容  
  showText: { type: Boolean, default: true },                   // 是否显示进度条文字
  canvWidth: { type: [Number, String], default: 126 }           // 容器大小
}