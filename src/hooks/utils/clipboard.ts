import { useMessage } from "src/packages/SaMessage"
import { createServiceWithoutContext } from "src/packages/SaRoot/utils/registryRootService"

export function clipboard(
  option: { text?: string, target?: HTMLElement }, 
  callback?: () => void, 
  error?: () => string | void
) {

  const {text, target} = option
  
  const $message = createServiceWithoutContext(useMessage)

  if(!!text && !!target){
    error ? error() : $message.success('复制失败，未知错误！')
    console.error('option.text and option.target, two must exist one!!!')
    return 
  }

  const input = document.createElement('input')

  input.setAttribute('style', `
    position: absolute;
    top: -99999em
  `)
  
  document.body.appendChild(input)

  input.value = !!text ? text : target!.innerText
  input.select()
  document.execCommand('copy')

  document.body.removeChild(input)
  
  callback ? callback() : $message.success('复制成功！')
}