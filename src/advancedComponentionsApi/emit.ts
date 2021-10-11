import { onBeforeUnmount, SetupContext } from "vue";

export type ObjectEmitOptions = Record<string, (...args: any[]) => boolean>

export type EmitToProp<E extends Record<string, (...args: any[]) => any>> =
  ('onUpdateModelValue' extends keyof E ? { onChange?: (...args: Parameters<E['onUpdateModelValue']>) => void } : {}) &
  {
    [k in keyof E]?: E[k] extends ((...args: any[]) => any) ? (...args: Parameters<E[k]>) => void : E[k]
  };


type EventListener<EmitsValue> = EmitsValue extends (...args: any[]) => any ? Parameters<EmitsValue> : never

export type ComponentEvent<Emit> = {
  emit: { [key in keyof Emit]: (...args: EventListener<Emit[key]>) => void },
  on: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
  once: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
  off: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
}

export const kebabCase = (str: string): string => {
  if (str.length > 1 && /[A-Z]/.test(str.charAt(0))) {
    str = str.charAt(0).toLowerCase() + str.substring(1)
  }
  return str.replace(/[A-Z]/g, (i) => '-' + i.toLowerCase())
}

export function getComponentEmitOptions(emits?: ObjectEmitOptions): any {
  if (!emits) {
    return {}
  }

  return Object.keys(emits || {}).reduce((prev, key) => {
    const emitter = emits[key]

    const match = key.match(/onUpdate([A-Z])(.*)/)

    const caseName = kebabCase(key).replace('on-', '')

    if (!!match) {
      const updateName = `update:${match[1].toLowerCase()}${match[2]}`
      prev[updateName] = emitter

      if (key === 'onUpdateModelValue') {
        prev['change'] = emitter
      }
    }

    prev[caseName] = emitter

    return prev
  }, {} as any)
}

export function useSetupEvent(ctx: SetupContext, emitsOptions?: ObjectEmitOptions) {
  const event = createPlainEvent()

  const emit = {} as any;
  const on = {} as any;
  const once = {} as any;
  const off = {} as any;

  const keys = Object.keys(emitsOptions || {})
  if (!!emitsOptions && !!(emitsOptions as any).onUpdateModelValue) { keys.push('onChange') }

  keys.forEach(key => {
    /*派发事件名称，横杠命名*/
    const match = key.match(/onUpdate([A-Z])(.*)/)
    const kebabCaseName = kebabCase(key).replace('on-', '')
    if (!!match) {
      const updateName = `update:${match[1].toLowerCase()}${match[2]}`
      emit[key] = (...args: any[]) => {
        ctx.emit(kebabCaseName, ...args)
        event.emit(kebabCaseName, ...args)
        ctx.emit(updateName, ...args)
        event.emit(updateName, ...args)
        if (key === 'onUpdateModelValue') {
          ctx.emit('change', ...args)
          event.emit('change', ...args)
        }
      }
    } else {
      emit[key] = (...args: any[]) => {
        ctx.emit(kebabCaseName, ...args)
        event.emit(kebabCaseName, ...args)
      }
    }
    on[key] = (fn: SimpleFunction) => event.on(kebabCaseName, fn)
    once[key] = (fn: SimpleFunction) => event.once(kebabCaseName, fn)
    off[key] = (fn: SimpleFunction) => event.off(kebabCaseName, fn)
  })

  onBeforeUnmount(event.clear)

  return {
    emit, on, once, off,
  }
}


export type SimpleFunction = (...args: any[]) => any
export type PlainObject = Record<string, any>

type Listener = (SimpleFunction & { fn?: any })
type ListenName = string | symbol

export function createPlainEvent() {
  const getListenMap = (() => {
    let events: Map<ListenName, Listener[]>;
    return () => {
      if (!events) {
        events = new Map<ListenName, Listener[]>()
      }
      return events
    }
  })()

  let hasListener = false

  const event = {
    on: (listenName: ListenName, fn: SimpleFunction) => {

      hasListener = true

      const listenMap = getListenMap()
      const map = listenMap.get(listenName)
      if (!!map) {
        map.push(fn)
      } else {
        listenMap.set(listenName, [fn])
      }
      return () => event.off(listenName, fn)
    },
    once: (listenName: ListenName, fn: SimpleFunction) => {

      hasListener = true

      const on: Listener = (...args: any[]) => {
        event.off(listenName, fn)
        fn(...args)
      }
      on.fn = fn
      event.on(listenName, on)
      return () => event.off(listenName, on)
    },
    off: (listenName: ListenName, fn?: SimpleFunction) => {
      const listenMap = getListenMap()

      const listeners = listenMap.get(listenName)
      if (!listeners) {
        return;
      }

      /*移除listenName的所有监听器*/
      if (!fn) {
        listenMap.set(listenName, [])
        return
      }

      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        if (fn === listener || (!!listener.fn && fn === listener.fn)) {
          listeners.splice(i, 1)
          break
        }
      }
    },
    emit: (listenName: ListenName, ...args: any[]) => {
      const listeners = getListenMap().get(listenName)
      if (!!listeners) {
        listeners.forEach(listener => listener(...args))
      }
    },
    clear: () => {
      if (hasListener) {
        getListenMap().clear()
      }
    }
  }

  return event
}

export type PlainEvent = ReturnType<typeof createPlainEvent>
