import { designComponent } from "src/advancedComponentionsApi/designComponent"
import { classname, EditProps, StyleProps, useModel, useRefs, useEditPopperAgent, useCollect } from "src/hooks"
import { computed, ref } from "vue"

import './SaSelect.scss'
import { SaInputInnertags } from "../SaInput/SaInputInnertags"
import { SaInput } from "../SaInput/SaInput"
import { useSelect } from "./useSelect"
import { SaSelectPanel } from "./SaSelectPanel"
import { PropType } from "vue"
import { SaSelectOption } from "../SaSelectOption/SaSelectOption"

const Props = {
  ...EditProps,
  ...StyleProps,

  modelValue: { type: [Array, String, Number] },                // 双绑
  inputProps: { type: Object as PropType<Partial<typeof SaInput.use.props>> },   // input组件绑定属性对象

  multiple: { type: Boolean },                                  // 是否开启多选
  maxMutipleLimit: { type: Number },                            // 最多选择个数
  minMutipleLimit: { type: Number },                            // 最少选择个数
  filterable: { type: Boolean },                                // 是否开启筛选过滤
  filterMethod: Function,                                       // 过滤函数

  maxTags: { type: Number },                                    // 显示tag的个数
  collapseTags: { type: Boolean, default: true },
  placeholder: { type: [String, Number], default: '' },         // placeholder 提示

}

export const SaSelect = designComponent({

  props: {
    ...Props
  },

  name: 'sa-select',
  emits: {
    onUpdateModelValue: (val?: string | number | string[]) => true,
    onClick: (option: any) => true,

    onBlur: (e: FocusEvent) => true,
    onFocus: (e: FocusEvent) => true
  },

  slots: ['default'],
  setup({ props, event, slots }) {

    const { emit } = event
    const { onRef, refs } = useRefs({ input: SaInput })


    let panel = null as typeof SaSelectPanel.use.class | null

    const model = useModel(() => props.modelValue as number | string | string[] | undefined, emit.onUpdateModelValue)


    const items = SelectCollector.parent()
    const formatData = computed(() => items.filter(i => !i.props.group))
    const popperHeight = computed(() => formatData.value.length > 6 ? 200 : null) // popper 高度


    const filterText = ref(null as string | null)
    const agentState = useEditPopperAgent({
      event,
      serviceGetter: useSelect,
      option: {
        reference: () => refs.input?.refs.input,
        renderAttrs: () => ({
          ref: r => panel = r,
          ...(() => {
            {
              const { loading, readonly, customReadonly, collapseTags, maxTags, inputProps, filterable, ...leftProps } = Props
              return Object.keys(leftProps).reduce((ret: any, key) => {
                ret[key] = (props as any)[key]
                return ret
              }, {})
            }
          })(),

          modelValue: model.value,
          height: popperHeight.value,
          content: slots.default,
          filterMethod: utils.filterMethod,
          onChange: handler.onServiceChange,
          onClick: event.emit.onClick,
        })
      }
    })

    const utils = {
      filterMethod: (option: { label?: string, val: string, disabled: boolean }) => {
        if (!!props.filterMethod) return props.filterMethod(filterText.value, option)
        return !!filterText.value && !!filterText.value.trim() ? (!!option.label && option.label.indexOf(filterText.value) > -1) : true
      }
    }
    const handler = {
      onServiceChange: (val: any) => model.value = val,
    }

    const inputBinding = computed(() => {
      return {
        ref: onRef.input,
        class: classname([
          'sa-select',
          {
            'pl-input-tags': !!props.multiple
          }
        ]),

        modelValue: (props.filterable)
      }
    })

    return {
      render: () => <SaInput {...inputBinding.value}>
        {{
          default: () => !props.multiple ? null : () => (
            <SaInputInnertags
              data={props.multiple}
              collapseTags={props.collapseTags}
              maxTags={props.maxTags}
              placeholder={!props.modelValue ? props.placeholder : null}
            />
          )
        }}
      </SaInput>
    }
  }
})

export const SelectCollector = useCollect(() => ({
  parent: SaSelect,
  child: SaSelectOption,
}))


export default SaSelect