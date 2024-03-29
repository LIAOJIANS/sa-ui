import {
  adjustPlacement,
  Align,
  debounce,
  Direction,
  getBoundaryPos,
  getPos,
  getTransformOriginByPlacement,
  isVertical,
  PlacementType,
  PopperConfig,
  setPos
} from './popperUtils'


export type StyleType = Partial<CSSStyleDeclaration>

export class Popper {

  private readonly content: HTMLElement
  private readonly arrow: HTMLElement | null
  private readonly arrowSize: number

  private get offset(): number {
    return this.config.offset! + this.arrowSize
  }


  constructor(private config: PopperConfig) {

    (config.padding == null && (config.padding = 10));
    (config.offset == null && (config.offset = 0));
    (config.placement == null && (config.placement = 'bottom-start'));
    (config.arrowSize == null && (config.arrowSize = 12));

    this.content = config.popper.querySelector('.sa-popper-content') as HTMLElement
    this.arrowSize = !config.arrowSize ? 0 : Math.sqrt(Math.pow(config.arrowSize, 2) / 2)
    this.arrow = this.arrowSize == 0 ? null : config.popper.querySelector('.sa-popper-arrow') as HTMLElement

    this.init()
  }

  private init() {

    Object.assign(this.config.popper.style,
      {
        overflow: 'hidden',
        position: 'fixed',
        pointerEvents: 'none'
      } as StyleType)

    Object.assign(this.content.style, {
      pointerEvents: 'auto',
      position: 'relative',
      boxSizing: 'border-box'
    } as StyleType)

    if (this.arrowSize > 0) {
      Object.assign(this.arrow!.style, {
        height: `${this.arrowSize}px`,
        width: `${this.arrowSize}px`,

        position: 'absolute',
        pointerEvents: 'none',
        backgroundColor: 'inherit',
        boxShadow: '-2px -2px 5px rgba(0, 0, 0, .1)',
      } as StyleType)
    }

    this.refresh()
    this.bindEvent()
  }

  public refresh(forceTransform = false) {
    let left = 0,
      top = 0

    const {
      content,
      offset
    } = this

    const {
      popper,
      reference,
      boundary,
      placement,
      gpuAcceleration,
      padding
    } = this.config as PopperConfig & { padding: number }

    const contentPos = getPos(content)

    const referencePos = getPos(reference)

    const {
      maxTop,
      minTop,
      maxLeft,
      minLeft
    } = getBoundaryPos(
      boundary,
      contentPos,
      padding
    )

    let {
      pos,
      direction,
      align
    } = adjustPlacement(
      placement!,
      referencePos,
      contentPos,
      offset,
      padding
    )

    switch (direction) {
      case Direction.top:
        if (pos.top < minTop) {
          const { pos: bottomPos } = adjustPlacement(`bottom-${align}` as Direction, referencePos, contentPos, offset, padding)
          if (bottomPos.top > maxTop) {
            top = pos.top
          } else {
            top = Math.max(minTop, bottomPos.top)
            direction = Direction.bottom
          }
        } else {
          top = Math.min(maxTop, pos.top)
        }
        left = Math.min(maxLeft, Math.max(minLeft, pos.left))
        break
      case Direction.bottom:
        if (pos.top > maxTop) {
          const { pos: topPos } = adjustPlacement(`top-${align}` as Direction, referencePos, contentPos, offset, padding)
          if (topPos.top < minTop) {
            top = pos.top
          } else {
            top = Math.min(maxTop, topPos.top)
            direction = Direction.top
          }
        } else {
          top = Math.max(minTop, pos.top)
        }
        left = Math.min(maxLeft, Math.max(minLeft, pos.left))
        break
      case Direction.left:
        if (pos.left < minLeft) {
          const { pos: rightPos } = adjustPlacement(`right-${align}` as Direction, referencePos, contentPos, offset, padding)
          if (rightPos.left > maxLeft) {
            left = pos.left
          } else {
            left = Math.max(minLeft, rightPos.left)
            direction = Direction.right
          }
        } else {
          left = Math.min(maxLeft, pos.left)
        }
        top = Math.min(maxTop, Math.max(minTop, pos.top))
        break
      case Direction.right:
        if (pos.left > maxLeft) {
          const { pos: leftPos } = adjustPlacement(`left-${align}` as Direction, referencePos, contentPos, offset, padding)
          if (leftPos.left < minLeft) {
            left = pos.left
          } else {
            left = Math.min(maxLeft, leftPos.left)
            direction = Direction.left
          }
        } else {
          left = Math.max(minLeft, pos.left)
        }
        top = Math.min(maxTop, Math.max(minTop, pos.top))
        break
    }


    (() => {
      const paddingProp = isVertical(direction) ? (direction === Direction.top ? 'Bottom' : 'Top') : (direction === Direction.left ? 'Right' : 'Left')

      ;['Top', 'Bottom', 'Left', 'Right'].forEach(item => (this.config.popper.style[`padding${item}` as any] = `${item === paddingProp ? offset : padding}px`))

      switch (paddingProp) {

        case 'Top':
          top += (padding - offset)
          break
        case 'Bottom':
          break
        case 'Left':
          left += (padding - offset)
        case 'Right':
          break
      }
    })()

    setPos(this.config.popper, { left, top }, forceTransform ? true : !!gpuAcceleration)

    this.content.style.transformOrigin = getTransformOriginByPlacement(`${direction}-${align}` as PlacementType)

    popper.setAttribute('direction', direction)
    popper.setAttribute('algin', align)

    this.refreshArrow(direction, align, forceTransform)
  }


  // private handleDirection = (() => {

  // })()

  private refreshArrow(
    direction: Direction,
    align: Align,
    forceTransform: boolean
  ) {
    if (!this.arrow) {
      return
    }

    const contentPos = getPos(this.content)

    const { arrowSize } = this

    let top: number,
      left: number,
      rotate = 0

    switch (direction) {
      case Direction.top:
        top = contentPos.height - arrowSize / 2
        rotate = 225
        break

      case Direction.bottom:
        top = -arrowSize / 2
        rotate = 45
        break

      case Direction.left:
        left = contentPos.width - arrowSize / 2
        rotate = 135
        break

      case Direction.right:
        left = -arrowSize / 2
        rotate = -45
        break

    }

    const paddingSize = arrowSize * 2

    if (isVertical(direction)) {
      switch (align) {
        case Align.start:
          left = paddingSize
          break
        case Align.center:
          left = (contentPos.width - arrowSize) / 2
          break
        case Align.end:
          left = (contentPos.width - arrowSize) - paddingSize
          break
      }
    } else {
      switch (align) {
        case Align.start:
          top = paddingSize
          break
        case Align.center:
          top = (contentPos.height - arrowSize) / 2
          break
        case Align.end:
          top = (contentPos.height - arrowSize) - paddingSize
          break
      }
    }

    const gpuAcceleration = forceTransform ? true : !!this.config.gpuAcceleration

    setPos(this.arrow!, { top: top!, left: left! }, gpuAcceleration)

    const transformRotate = `rotate(${rotate}deg)`
    Object.assign(this.arrow.style, {
      transform: gpuAcceleration ? `${this.arrow.style.transform} ${transformRotate}` : transformRotate
    } as StyleType)

  }

  private scrollEventListener: { el: HTMLElement, listener: Function }[] = []

  private onWindowResize = () => {
    this.refresh()
  }

  resetPositioningMode = debounce(() => this.refresh, 150)

  private onParentScroll = () => {
    if (!!this.config.shouldUpdate) {
      if (!this.config.shouldUpdate()) {
        return
      }

    }

    this.refresh(true)
    this.resetPositioningMode()
  }

  private bindEvent() {
    let parentEl = this.config.reference.parentNode as HTMLElement

    while (!!parentEl) {
      parentEl.addEventListener('scroll', this.onParentScroll)
      this.scrollEventListener.push({ el: parentEl, listener: this.onParentScroll })
      parentEl = parentEl.parentNode as HTMLElement
    }

    window.addEventListener('resize', this.onWindowResize)
  }

  private unbindEvent(): void {
    let scrollEventListener = this.scrollEventListener

    while (scrollEventListener.length > 0) {
      let { el, listener } = scrollEventListener.pop()!
      el.removeEventListener('scroll', listener as any)
    }

    window.removeEventListener('resize', this.onWindowResize)
  }

  public destroy() {
    this.unbindEvent()
  }

  public setPlacement(placement: PlacementType) {
    this.config.placement = placement
    this.refresh()
  }
}