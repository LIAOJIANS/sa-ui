import { SimpleFunction } from 'src/hooks/utils/event';
import { PopperTrigger, ProperTriggerType } from './PopperTrigger';

export interface triggerFunc {
  on: {
    onEnterReference: SimpleFunction;
    onLeaveReference: SimpleFunction;

    onEnterPopper: SimpleFunction;
    onLeavePopper: SimpleFunction;

    onReferenceFocus: SimpleFunction;
    onReferenceBlur: SimpleFunction;

    onClickReference: SimpleFunction;
    onClickBody: SimpleFunction;
    onClickPopper: SimpleFunction;
  };
  off: {
    onEnterReference: SimpleFunction;
    onLeaveReference: SimpleFunction;

    onEnterPopper: SimpleFunction;
    onLeavePopper: SimpleFunction;

    onReferenceFocus: SimpleFunction;
    onReferenceBlur: SimpleFunction;

    onClickReference: SimpleFunction;
    onClickBody: SimpleFunction;
    onClickPopper: SimpleFunction;
  };
  emit: {
    onReferenceFocus: SimpleFunction;
    onReferenceBlur: SimpleFunction;

    onEnterReference: SimpleFunction;
    onLeaveReference: SimpleFunction;

    onEnterPopper: SimpleFunction;
    onLeavePopper: SimpleFunction;
  };
}

export function getBaseTrigger(
  triggerName: ProperTriggerType,
  {
    model,

    show,
    hide,

    hoverOpenDelay,
    hoverCloseDelay,
    reference,

    on,
    off,
    emit,
  }: {
    model: { value: boolean | undefined };

    show: SimpleFunction;
    hide: SimpleFunction;

    hoverOpenDelay: number;
    hoverCloseDelay: number;
    reference: HTMLElement;
  } & triggerFunc,
) {
  
  switch (triggerName) {
    case ProperTriggerType.hover:
      return getHoverTrigger({
        model,
        show,
        hide,
        hoverCloseDelay,
        hoverOpenDelay,

        on,
        off,
        emit,
      });
    case ProperTriggerType.click:
      return getClickTrigger({
        model,
        show,
        hide,

        on,
        off,
      });

    case ProperTriggerType.focus:
      return getFocusTrigger({
        show,
        hide,
        reference,
        on,
        off,
        emit,
      })

    case ProperTriggerType.manual:
      return getManualTrigger()
  }
}

function getHoverTrigger({
  model,

  show,
  hide,

  hoverOpenDelay,
  hoverCloseDelay,

  on,
  off,
  emit,
}: {
  model: { value: boolean | undefined };
  show: SimpleFunction;
  hide: SimpleFunction;
  hoverOpenDelay: number;
  hoverCloseDelay: number;
  on: {
    onEnterReference: SimpleFunction,
    onLeaveReference: SimpleFunction,

    onEnterPopper: SimpleFunction,
    onLeavePopper: SimpleFunction,

    onReferenceFocus: SimpleFunction,
    onReferenceBlur: SimpleFunction,

    onClickReference: SimpleFunction,
    onClickPopper: SimpleFunction,
  },
  off: {
    onEnterReference: SimpleFunction,
    onLeaveReference: SimpleFunction,

    onEnterPopper: SimpleFunction,
    onLeavePopper: SimpleFunction,

    onReferenceFocus: SimpleFunction,
    onReferenceBlur: SimpleFunction,

    onClickReference: SimpleFunction,
    onClickPopper: SimpleFunction,
  },
  emit: {
    onReferenceFocus: SimpleFunction,
    onReferenceBlur: SimpleFunction,

    onEnterReference: SimpleFunction,
    onLeaveReference: SimpleFunction,

    onEnterPopper: SimpleFunction,
    onLeavePopper: SimpleFunction,
  }
}) {
  let closeTimer: number | undefined
  let openTimer: number | undefined

  const handler = {
    reference: {
      enter: () => {
        if (!!closeTimer) {
          clearTimeout(closeTimer)
          closeTimer = undefined
        }

        openTimer = setTimeout(() => {
          show()
          openTimer = undefined

          emit.onEnterReference(model.value)
        }, hoverOpenDelay) as any as number
      },

      leave: () => {
        if (!!openTimer) {
          clearTimeout(openTimer)
          openTimer = undefined
        }

        closeTimer = setTimeout(() => {
          hide()
          closeTimer = undefined

          emit.onLeaveReference
        }, hoverCloseDelay) as any as number
      }
    },

    popper: {
      enter: () => {
        if (!!closeTimer) {
          clearTimeout(closeTimer)
          closeTimer = undefined
        }

        openTimer = setTimeout(() => {
          show()
          openTimer = undefined
        }, hoverOpenDelay) as any as number
      },

      leave: () => {
        if (!!openTimer) {
          clearTimeout(openTimer)
          openTimer = undefined
        }

        closeTimer = setTimeout(() => {
          hide()

          closeTimer = undefined
        }, hoverCloseDelay) as any as number
      }
    }
  }

  return new PopperTrigger(
    ProperTriggerType.hover,
    () => {
      on.onEnterReference(handler.reference.enter)
      on.onLeaveReference(handler.reference.leave)

      on.onEnterPopper(handler.popper.enter)
      on.onLeavePopper(handler.popper.leave)
    },
    () => {
      off.onEnterReference(handler.reference.enter)
      off.onLeaveReference(handler.reference.leave)

      off.onEnterPopper(handler.popper.enter)
      off.onLeavePopper(handler.popper.leave)
    }
  )
}

function getClickTrigger({
  model,
  show,
  hide,
  on,
  off,
}: {
  model: { value: boolean | undefined };
  show: SimpleFunction;
  hide: SimpleFunction;

  on: {
    onClickReference: SimpleFunction;
    onClickBody: SimpleFunction;
  };
  off: {
    onClickReference: SimpleFunction;
    onClickBody: SimpleFunction;
  };
}) {
  const handler = {
    onClickReference: () => {
      model.value ? hide() : show()
    }
  }

  return new PopperTrigger(
    ProperTriggerType.click,
    () => {
      on.onClickReference(handler.onClickReference)
    },
    () => {
      off.onClickReference(handler.onClickReference)
    }
  )
}

function getFocusTrigger({
  show,
  hide,
  reference,
  on,
  off,
  emit,
}: {
  show: SimpleFunction;
  hide: SimpleFunction;
  reference: HTMLElement;
} & triggerFunc) {
  let oldTableIndex: string | null

  const handler = {
    focus: (e: FocusEvent) => {
      emit.onReferenceFocus(e)
      show()
    },

    blur: (e: Event) => {
      emit.onReferenceBlur(e)
      hide()
    }
  }

  return new PopperTrigger(
    ProperTriggerType.focus,
    () => {
      oldTableIndex = reference.getAttribute('tableIndex')
      if (oldTableIndex == null) {
        reference.setAttribute('tableIndex', '0')
      }

      on.onReferenceFocus(handler.focus)
      on.onReferenceBlur(handler.blur)
    },
    () => {
      oldTableIndex == null ? reference.removeAttribute('tableIndex') : reference.setAttribute('tableIndex', '0')

      off.onReferenceFocus(handler.focus)
      off.onReferenceBlur(handler.blur)
    }
  )
}

function getManualTrigger() {
  
  return new PopperTrigger(
    ProperTriggerType.manual,
    () => undefined,
    () => undefined,
  );
}
