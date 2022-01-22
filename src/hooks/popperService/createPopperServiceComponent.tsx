import { createDefaultService } from "src/packages/SaRoot/createDefaultService"
import { PopperServiceComponentOption } from "../use/useEditPopperAgent"
import SaPopper from '../../packages/SaPopper/SaPopper'
import { computed, reactive, ref } from "vue"
import { delay } from "../utils/delay"

export function createCounter(prefixString?: string) {
  let count = 0
  return () => (!!prefixString ? `${prefixString}_` : '') + count++
}

const counter = createCounter('popper-service-component')

const mergeAttrs = (() => {
  const regexp = /on[A-Z]/

  return (config: { attrs: any, defaultAttrs: any, agent: any }) => {
    const { agent } = config

    let attrs = config.attrs || {}
    let defaultAttrs = config.defaultAttrs || {}
    if (typeof attrs === 'function') {
      attrs = attrs()
    }

    if (typeof defaultAttrs === 'function') {
      defaultAttrs = defaultAttrs()
    }

    const result = {} as any

    Object
      .keys({ ...attrs, ...defaultAttrs })
      .forEach(k => {
        if (regexp.test(k)) {
          result[k] = (...args: any[]) => {
            !!(attrs as any)[k] && (attrs as any)[k].apply(agent, args)
            !!(defaultAttrs as any)[k] && (defaultAttrs as any)[k].apply(agent, args)
          }
        } else {
          result[k] = k in attrs ? attrs[k] : defaultAttrs[k]
        }
      })

    return result
  }
})()

export function createPopperServiceComponent(name: string) {
  return createDefaultService({
    name,
    setup(option: PopperServiceComponentOption) {
      const isShow = ref(false)  // 表示当前是否显示、隐藏
      const isOpen = ref(false)  // 表示当前是否已经显示、隐藏

      const state = reactive({
        option,
        renderKey: counter()
      })

      async function service(option: PopperServiceComponentOption) { // 创建服务
        let newKey = true
        if (!option.getService || option.getService !== getRefer) {
          /*clear*/
          state.option.getService = undefined
          /*init*/
          state.option = option
          state.option.getService = getRefer
          state.renderKey = counter()
          newKey = false
          await delay()
        }
        await show(newKey)
      }

      async function show(newKey = true) { // 显示
        if (newKey) {
          state.renderKey = counter()
          await delay()
        }
        isShow.value = true
      }

      const hide = () => isShow.value = false // 淫仓

      const refer = { isOpen, isShow, service, hide, state, show } // 暴露方法

      const getRefer = () => refer // 用于标记service与option的绑定关系

      const popperAttrs = computed(() => { // 合并popper属性
        let { defaultOption: { defaultPopperAttrs }, serviceOption: { popperAttrs } } = state.option
        return mergeAttrs({ agent: refer, attrs: popperAttrs, defaultAttrs: defaultPopperAttrs, })
      })

      // 合并后的render属性
      const renderAttrs = computed(() => {
        let { defaultOption: { defaultRenderAttrs }, serviceOption: { renderAttrs } } = state.option
        return {
          ...mergeAttrs({ agent: refer, attrs: renderAttrs, defaultAttrs: defaultRenderAttrs, }),
          key: state.renderKey,
        }
      })

      const handler = {
        onClickBody: () => {
          if (state.option.serviceOption.hideOnClickBody !== false) {
            refer.hide()
          }
        },
      }

      return {
        refer,
        render: () => (
          <SaPopper
            v-model={isShow.value}
            onClickBody={handler.onClickBody}
            popperAttrs={{ ['service-name']: name }}
            transition={'sa-transition-scale'} noContentPadding
            trigger={'manual'}
            reference={state.option.serviceOption.reference}
            onUpdateOpen={(val: any) => isOpen.value = !!val}
            {...popperAttrs.value}
            v-slots={{
              popper: () => state.option.defaultOption.render(renderAttrs.value)
            }}
          />
        )
      }
    }
  })
}