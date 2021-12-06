export type Boundary = HTMLElement | string;

export type PlacementType = 'top-start' | 'top-center' | 'top-end' | 'top' |
  'bottom-start' | 'bottom-center' | 'bottom-end' | 'bottom' |
  'left-start' | 'left-center' | 'left-end' | 'left' |
  'right-start' | 'right-center' | 'right-end' | 'right';

export interface Pos {
  width: number,
  height: number,
  top: number,
  left: number
}

export enum Direction {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}

export enum Align {
  start = 'start',
  center = 'center',
  end = 'end'
}

export interface PopperConfig {
  popper: HTMLElement,                                    // 浮层元素
  reference: HTMLElement,                                 // 目标元素
  padding?: number,                                       // PlainPopper节点 外边距
  offset?: number,                                        // popper 与 reference 在方向上的距离
  boundary?: Boundary | undefined | null,                 // 边界元素,
  placement?: PlacementType | undefined | null,           // 位置
  arrowSize?: number,                                     // 箭头大小，设置为0则不初始化箭头
  gpuAcceleration?: boolean,                              // 是否使用 transform 定位
  shouldUpdate?: () => boolean,                           // 是否可以刷新定位
}

export function getEl(el: any): HTMLElement | null {
  if (el === null) {
    return null
  }

  if (el === window || el === 'window') {
    return document.documentElement
  }

  if (typeof el === 'string') {
    let ret = document.querySelector(el)

    if (ret === null) {
      throw Error('this element cannot be found！！')
    }

    return ret as HTMLElement
  } else {
    return el
  }
}

export function getPos(el: HTMLElement): Pos {
  const rect = el.getBoundingClientRect()!
  const { offsetHeight, offsetWidth } = el
  return {
    left: rect.left,
    top: rect.top,
    width: offsetWidth || Math.ceil(rect.width),
    height: offsetHeight || Math.ceil(rect.height)
  }
}

export const setPos = (
  el: HTMLElement,
  { left, top }: { left: number, top: number },
  gpuAcceleration: boolean
) => {
  if(gpuAcceleration) {
    el.style.transform = `translate3d(${left}px,${top}px,0)`
    el.style.transitionDuration = '0ms';
    (el.style as any).willChange = 'transform'
    el.style.left = '0'
    el.style.top = '0'
  } else {
    el.style.left = `${left}px`
    el.style.top = `${top}px`

    el.style.transform = ''
    el.style.transitionDuration = '';
    (el.style as any).willChange = ''
  }
}

export const isVertical = (direction: Direction): Boolean => { // 判断是否为纵向
  return [Direction.top, Direction.bottom].indexOf(direction) > -1
}

const origin ={
  'top-start': 'bottom left',
  'top-center': 'bottom center',
  'top-end': 'bottom right',
  'bottom-start': 'top left',
  'bottom-center': 'top center',
  'bottom-end': 'top right',
  'left-start': 'right top',
  'left-center': 'right center',
  'left-end': 'right bottom',
  'right-start': 'left top',
  'right-center': 'left center',
  'right-end': 'left bottom',
} as Record<string, string>

export const getTransformOriginByPlacement = (placement: PlacementType) => {
  return origin[placement]
}

export const getBoundaryPos = (
  boundary: Boundary | null | undefined,
  contentRef: { width: number, height: number },
  padding: number
): {
  maxTop: number,
  minTop: number,
  maxLeft: number,
  minLeft: number
} => {
  if (!boundary) {
    return {
      maxTop: Infinity,
      minTop: -Infinity,
      maxLeft: Infinity,
      minLeft: -Infinity
    }
  } else {
    const boundaryEl = getEl(boundary)!
    const { top, left, width, height } = getPos(boundaryEl)

    return {
      minTop: top,
      maxTop: top + height - contentRef.height - padding,
      minLeft: left,
      maxLeft: width + left - contentRef.width - padding
    }
  }
}

export const adjustPlacement = (
  placement: PlacementType,
  referencePos: Pos,
  contentPos: Pos,
  offset: number,
  padding: number
): {
  pos: { top: number, left: number },
  direction: Direction,
  align: Align,
} => {
  
  let [direction, align] = placement.split('-') as [Direction, Align]
  align = align || Align.center

  let top = 0,
    left = 0

  if (isVertical(direction)) {
    top = direction === Direction.top ? (referencePos.top - contentPos.height - padding) : (referencePos.top + (referencePos.height - padding))

    left = {
      [Align.start]: referencePos.left,
      [Align.center]: referencePos.left - (contentPos.width - referencePos.width) / 2,
      [Align.end]: referencePos.left + referencePos.width - contentPos.width
    }[align]

    left -= padding


  } else {
    left = direction === Direction.left ? (referencePos.left - contentPos.width - padding) : (referencePos.left + (referencePos.width - padding))
    top = {
      [Align.start]: referencePos.top,
      [Align.center]: referencePos.top - (contentPos.height - referencePos.height) / 2,
      [Align.end]: referencePos.top + referencePos.height - contentPos.height
    }[align]

    top -= padding
  }

  top = {
    [Direction.top]: top - offset,
    [Direction.bottom]: top + offset,
    [Direction.left]: top - offset,
    [Direction.right]: top + offset
  }[direction]


  return {
    pos: {
      top,
      left
    },
    direction,
    align
  }
}

export const debounce = <T extends Function>(func: T, wait: number, immediate?: boolean): T => {
  let timeout: any

  return function (...args: any[]) {
      // @ts-ignore
      const context = this
      clearTimeout(timeout)
      if (immediate) {
          let callNow = !timeout
          // @ts-ignore
          if (callNow) func.apply(this, args)
      }
      timeout = setTimeout(() => {
          func.apply(context, args)
          timeout = null
      }, wait)
  } as any
}
