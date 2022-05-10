
/* ------------------------------- USE ---------------------------- */
import { StyleProps, TitleStyleProps, useStyle, useStyles, DEFAULT_STATUS } from './use/useStyle'
import { useNumber } from './use/useNumber'
import useModel from './use/useModel'
import useRefs from './use/useRefs'
import { EditProps, useEdit } from './use/useEdit'
import { useRefList } from './use/useRefList'
import { useEditPopperAgent } from './use/useEditPopperAgent'
import { useCollect } from './use/useCollect'

/* ------------------------------- UTILS ---------------------------- */
import { unit, removeUnit } from './utils/unit'
import classname from './utils/className'
import { nextIndex } from './utils/nextIndex'
import { getElement } from './utils/getElement'
import { delay } from './utils/delay'
import { throttle } from './utils/throttle'
import { disabledUserSelect, enableUserSelect } from './utils/userSelect'
import { defer } from './utils/defer'

/* --------------------- POPPER-SERVICE ------------------------------- */

import { createPopperServiceComponent, createCounter } from './popperService/createPopperServiceComponent'
import { createUseEditPopperAgent } from './popperService/createAgentGetter'

/* --------------------------- GLOBAL CONFIG ----------------------- */
import { CheckboxStatus } from './utils/config'

export {
  useStyle,
  useStyles,
  useNumber,
  useModel,
  useRefs,
  useEdit,
  useRefList,
  useEditPopperAgent,
  useCollect,
  
  StyleProps,
  TitleStyleProps,
  DEFAULT_STATUS,
  EditProps,

  unit,
  removeUnit,
  classname,
  nextIndex,
  getElement,
  delay,
  throttle,
  defer,

  createPopperServiceComponent,
  createCounter,

  createUseEditPopperAgent,

  disabledUserSelect,
  enableUserSelect,

  CheckboxStatus
}