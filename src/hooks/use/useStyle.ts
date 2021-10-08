import { computed, inject, PropType, provide, CSSProperties } from 'vue'
import useFunctionWrapper from './useFunctionWrapper'

export enum StyleStatus {
  primary = 'primary',
  success = 'success',
  error = 'error',
  warn = 'warn',
  info = 'info'
}

export enum StyleSize {
  normal = 'normal',
  large = 'large',
  mini = 'mini'
}

export enum StyleShape {
  fillet = 'fillet',
  round = 'round',
  square = 'square',
}

export const StyleProps = {
  shape: { type: String as PropType<keyof typeof StyleStatus> },
  status: { type: String as PropType<keyof typeof StyleStatus> },
  size: { type: String as PropType<keyof typeof StyleSize> }
}

interface UseStyleProvideData {
  shape: StyleShape,
  size: StyleSize,
  status?: StyleStatus,
}

interface UseStyleOption {
  shape?: StyleShape,
  status?: StyleStatus,
  size?: StyleSize,
  adjust?: (data: UseStyleProvideData) => void | UseStyleProvideData
}

const USE_STYLE_PROVIDER = '@@USE_STYLE_PROVIDER'

export const useStyle = useFunctionWrapper('style', (
  ctx,
  option: UseStyleOption = {}
): {
  styleComputed: { value: UseStyleProvideData }
} => {
  const parent = inject(USE_STYLE_PROVIDER, null) as null | { value: UseStyleProvideData }

  const defaultDate = {
    shape: StyleShape.fillet,
    size: StyleSize.normal,
    ...option
  }

  const styleComputed = computed(() => {
    const { size, shape, status } = ctx.props
    
    const parentData = !!parent ? parent.value : {} as any

    let data: UseStyleProvideData = {
      shape: shape || parentData.shape || defaultDate.shape,
      size: size || parentData.size || defaultDate.size,
      status: status || parentData.status || defaultDate.status
    }

    if(!!defaultDate.adjust) {
      data = defaultDate.adjust(data) || data
    }

    (data as any).ctx = ctx
    ;(data as any).parent = parent

    return data
  })

  provide(USE_STYLE_PROVIDER, styleComputed)

  return { styleComputed }
})

export type IStylePropertties = { [k in keyof CSSProperties]: string | number | undefined | null }

export function useStyles(
  getter: (styles: IStylePropertties) => IStylePropertties | void
) {
  return computed(() => getter({}) || {})
}