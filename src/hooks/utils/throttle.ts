

/**
* 节流
* @param   func                //核心函数
* @param   wait                //节流时长（该时间段内只执行一次func）
* @param   options.trailing    //最后一次应该被触发，默认为true
* @param   options.leading     //第一次是否立即执行
**/
export const throttle = <T extends Function>(
  func: T,
  wait: number,
  option: { trailing?: boolean, leading?: boolean } = {}
) => {
  let args: any,
    context: any,
    previous = 0,
    timeout: any

  let later = () => {
    previous = option.trailing === false ? 0 : Date.now()
    func.apply(context, args)
    args = context = timeout = null
  }

  return function () {
    // @ts-ignore
    context = this
    args = arguments

    let now = Date.now()

    if (!previous && option.leading === false) {
      previous = now
    }

    let remaining = wait - (now - previous)

    if (remaining <= 0) {

      if (timeout) { // 第一次
        clearTimeout(timeout)
        timeout = null
      }
      func.apply(context, args)
      previous = now

    } else if (!timeout && option.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
  }
}