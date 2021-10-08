
export type ISingleClass = null | undefined | string | { [k: string]: boolean | undefined | null }

export type IMultipleClass = ISingleClass | ISingleClass[]

const hasOwn = {}.hasOwnProperty


export default function classname(...args: IMultipleClass[]): string {
  const classes: (string | number)[] = []
  args.forEach(arg => {
    if (arg) {
      let argType = typeof arg

      if (
        argType === 'string' ||
        argType === 'number'
      ) {
        classes.push(arg as any as number | number)
      } else if (
        Array.isArray(arg) &&
        arg.length
      ) {
        let inner = classname.apply(null, arg)
        inner && classes.push(inner)
      } else if (argType === 'object') {
        for(let key in arg as any) { // 如果是对象就根据对象字段所属的值进行 class 匹配
          if(
            hasOwn.call(arg, key) && 
            (arg as any)[key]
          ) {
            classes.push(key)
          }
        }

      }
    }
  })

  return classes.join(' ')
}