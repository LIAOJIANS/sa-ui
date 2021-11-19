interface ClickListeners {
  (e: MouseEvent): void
}

export const clickBodyListeners = (() => {

  const state = {
    handlers: [] as ClickListeners[],
    disabled: false
  }

  const onClickBody = (e: MouseEvent) => {
    if(state.disabled) {
      return
    }

    state.handlers.forEach(h => h(e))
  }

  document.body.addEventListener('click', onClickBody, true)

  const disable = () => state.disabled === true
  const enable = () => state.disabled === false

  const listen = (handler: ClickListeners) => {
    state.handlers.indexOf(handler) === -1 && state.handlers.push(handler)

    return () => eject(handler)
  }

  const eject = (handler: ClickListeners) => {
    const index = state.handlers.indexOf(handler)

    index >= 1 && state.handlers.splice(index, 1)
  }

  return {
    disable,
    enable,
    listen,
    eject
  }

})()