import { VueNode } from "src/advancedComponentionsApi/designComponent.utils";
import { RequireFormat } from "src/hooks/utils/RequireFormat";

export enum MessageServiceDirection {
  start = 'start',
  center = 'center',
  end = 'end'
}

export type MessageServiceStatus = 'primary' | 'success' | 'warn' | 'error' | 'info' | 'lite' | 'dark'

export interface MessageServiceOption {
  message?: string,

  horizontal?: MessageServiceDirection, // X轴位置
  vertical?: MessageServiceDirection,  // Y轴位置
  distance?: number | null,    // 停留时间
  status?: MessageServiceStatus,  // 消息状态
  icon?: string | null,
  render?: () => VueNode,  // 自定义内容
  onClick: (e: MouseEvent) => void  // 自定义内容点击事件
  onClose?: () => void
}

export type MessageServiceFormatOption = RequireFormat<MessageServiceOption, 'horizontal' | 'vertical' | 'distance' | 'status'> & {
  id: string,
  close: () => void,
}

