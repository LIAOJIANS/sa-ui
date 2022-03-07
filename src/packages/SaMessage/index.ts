import { VueNode } from "src/advancedComponentionsApi/designComponent.utils";
import { STATUS } from "src/hooks/utils/config";
import { RequireFormat } from "src/hooks/utils/RequireFormat";
import { createUseService } from "../SaRoot/utils/registryRootService";
import {  SaMessageManager } from "./SaMessageManager";

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
  onClick?: (e: MouseEvent) => void  // 自定义内容点击事件
  onClose?: () => void
}

const formatOption = (() => {
  let idCount = 0
  return (option: MessageServiceOption): MessageServiceFormatOption => {

    const status = option.status === null ? null : (option.status || 'primary')

    return Object.assign(option as MessageServiceFormatOption, {
      id: `message_${idCount++}`,
      close: () => null,
      horizontal: option.horizontal || MessageServiceDirection.center,
      vertical: option.vertical || MessageServiceDirection.start,
      distance: option.distance === null ? null : (option.distance || 30 * 1000),
      status,
      icon: option?.icon !== undefined ? option.icon : (!status ? null : STATUS[status].icon),
    })
  }
})()

export type MessageServiceFormatOption = RequireFormat<MessageServiceOption, 'horizontal' | 'vertical' | 'distance' | 'status'> & {
  id: string,
  close: () => void,
}

interface MessageServiceFunction {
  (message: string | MessageServiceOption, option?: MessageServiceOption): MessageServiceFormatOption
}

export type MessageService = MessageServiceFunction & {
  [k in MessageServiceStatus]: MessageServiceFunction
}


export const useMessage = createUseService({
  name: 'message-service',
  optionsCallName: '$message',
  managerComponent: SaMessageManager,
  createService: (getManager) => {
    const service: MessageServiceFunction = (message: string | MessageServiceOption, option?: MessageServiceOption) => {
      let o = typeof message === "object" ? message : { message }
      if (!!option) {
        Object.assign(o, option)
      }
      const fo = formatOption(o)
      // fo.horizontal.charAt(0)
      getManager().then(manager => manager.getContainer(fo).then(container => container.getMessage(fo)))
      return fo
    }

    return Object.assign(service, [
      'lite',
      'dark',
      'primary',
      'success',
      'warn',
      'error',
      'info',
    ].reduce((prev: any, status: any) => {
      prev[status] = function (message: string | MessageServiceOption, option?: MessageServiceOption) {
        const o = typeof message === "object" ? message : { message }
        if (!!option) {
          Object.assign(o, option)
        }
        o.status = status
        return service(o)
      }
      return prev
    }, {})) as MessageService
  }
})
