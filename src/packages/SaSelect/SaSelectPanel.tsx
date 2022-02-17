import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useNumber, useRefs, useCollect, classname, useStyles, unit, useModel } from "src/hooks";
import { computed, PropType, ref } from "vue";
import { SaScroll } from "../SaScroll/SaScroll";
import { SaSelectOption, SelectOption } from "../SaSelectOption/SaSelectOption";
import SaIcon from '../SaIcon/SaIcon'

export const SaSelectPanel = designComponent({

  name: 'sa-select-panel',

  props: {
    modelValue: { type: [Number, Array, String] },

    multiple: { type: Boolean },
    multipleMaxLimit: { type: [Number, String] },                     // 多选最多选择个数
    multipleMinLimit: { type: [Number, String] },                     // 多选最少选择个数

    noMatchText: { type: String, defalut: '暂无匹配数据' },
    noDataText: { type: String, defalue: '暂无数据' },

    filterMethod: { type: Function as PropType<(option: { val: string | number, label: string | number, disabled?: boolean }) => boolean> },// 筛选过滤函数

    content: { type: [Object, Function] },
    height: { type: Number },

    showDebug: { type: Boolean }
  },

  provideRefer: true,
  slots: ['defalut'],

  emits: {
    onUpdateModelValue: (val: number | string | string[]) => true,
    onClick: (option: SelectOption) => true,
  },

  setup({ props, slots, event: { emit } }) {

    const { numberState } = useNumber(props, ['multipleMaxLimit', 'multipleMinLimit'])

    const { refs, onRef } = useRefs({ scroll: SaScroll })

    const items = SelectPanelCollector.parent() // 获取option的子组件

    const options = computed(() => items.filter((i: any) => !i.props.group)) // 筛选出有效的option

    const showOptions = computed(() => options.value.filter((o: any) => utils.isShow(o.props)))    

    const current = ref(null as null | SelectOption)

    const model = useModel(() => props.modelValue as number | string | string[], emit.onUpdateModelValue)

    const utils = {
      isShow: (optionProps: { label: string | number, val: string | number, disabled?: boolean }) => !props.filterMethod || props.filterMethod(optionProps),
      isSelected: (optionProps: { label: string | number, val: string | number, disabled?: boolean }) => {
        if (!model.value) return false
        if (!props.multiple) {
          return (model.value as string) == optionProps.val
        } else {
          return (model.value as string[]).indexOf(optionProps.val! as string) > -1
        }
      },
    }


    const classes = computed(() => classname([
      'sa-select-panel',
      {
        'sa-select-panel-multiple': props.multiple
      }
    ]))

    const styles = useStyles(style => {
      !!props.height && (style.height = unit(props.height))
      return style
    })

    const handler = {
      clickOption: (option: SelectOption) => {

        if (option.props.disabled) return

        emit.onClick(option)

        if (!props.multiple) {
          model.value = option.props.val
        } else {
          const newValue: any[] = [...((model.value as string[]) || [])]
          const index = newValue.indexOf(option.props.val!)
          if (index > -1) {
            if (!!numberState.multipleMinLimit && newValue.length <= numberState.multipleMinLimit) {
              console.log(`最少选择 ${numberState.multipleMinLimit} 个选项`);
              return
            }
            newValue.splice(index, 1)
          } else {
            if (!!numberState.multipleMaxLimit && newValue.length >= numberState.multipleMaxLimit) {
              console.log(`最多选择 ${numberState.multipleMaxLimit} 个选项`);

              return
            }
            newValue.push(option.props.val!)
          }
          model.value = [...newValue]
        }
      },
    }

    const methods = {
      highlightPrev: () => {
        if (showOptions.value.length === 0) {
          return
        }
        if (!current.value) {
          current.value = showOptions.value[showOptions.value.length - 1]

          // 滚动到高亮的选项
          if (!!refs.scroll) {
            const el = current.value.refs.el!
            refs.scroll.methods.scrollTop(el.offsetTop, 200)
          }
        } else {
          let index = showOptions.value.indexOf(current.value)
          if (index === 0) {
            index = showOptions.value.length - 1
            current.value = showOptions.value[index]

            // 滚动到高亮的选项
            if (!!refs.scroll) {
              const el = current.value.refs.el!
              refs.scroll.methods.scrollTop(el.offsetTop, 200)
            }
          } else {
            index--
            current.value = showOptions.value[index]

            // 滚动到高亮的选项
            if (!!refs.scroll) {
              const el = current.value.refs.el!
              const { wrapperScrollTop } = refs.scroll.freezeState
              if (wrapperScrollTop > el.offsetTop) {
                refs.scroll.methods.scrollTop(el.offsetTop, 200)
              }
            }
          }
        }
      },
      highlightNext: () => {
        if (showOptions.value.length === 0) {
          return
        }
        if (!current.value) {
          current.value = showOptions.value[0]
        } else {
          let index = showOptions.value.indexOf(current.value)
          if (index === showOptions.value.length - 1) {
            index = 0
            current.value = showOptions.value[index]

            // 滚动到高亮的选项
            if (!!refs.scroll) {
              refs.scroll.methods.scrollTop(0, 200)
            }
          } else {
            index++
            current.value = showOptions.value[index]

            // 滚动到高亮的选项
            if (!!refs.scroll) {
              const el = current.value.refs.el!
              const { state: { hostHeight }, freezeState: { wrapperScrollTop } } = refs.scroll
              const scrollTop = el.offsetTop + el.offsetHeight - hostHeight
              if (scrollTop > 0 && scrollTop > wrapperScrollTop) {
                refs.scroll.methods.scrollTop(scrollTop, 200)
              }
            }
          }
        }


      },
      selectHighlight: () => {
        if (showOptions.value.length === 0) {
          return
        }
        if (!current.value) {
          methods.highlightNext()
        }
        if (!!current.value) {
          handler.clickOption(current.value as any)
        }
      },
    }

    return {

      refer: {
        props,
        handler,
        methods,
        utils,
        current,
      },

      render: () => {
        const inner = <>
          {options.value.length === 0 || showOptions.value.length === 0 ? (
            <div class="sa-select-panel-empty-text">
              <SaIcon icon="el-icon-nodata" />
              {options.value.length === 0 ? props.noDataText : props.noMatchText}
            </div>
          ) : null}
          {slots.defalut()}
          {!!props.content ? (typeof props.content === 'function' ? props.content() : props.content) : null}
          {!!props.showDebug ? (
            <div class="sa-select-panel-debug">
              {options.value.map((option: any) => <div key={option.props.val}>{option.props.label}__{option.props.val}__{option.props.disabled}</div>)}
            </div>
          ) : null}
        </>

        console.log(inner)

        const content: any = !!props.height ? (
          <SaScroll fitHostWidth ref={onRef.scroll}>{inner}</SaScroll>
        ) : inner

        return (
          <div class={classes.value} style={styles.value}>
            {content}
          </div>
        )
      }
    }
  }
})


export const SelectPanelCollector = useCollect(() => ({
  parent: SaSelectPanel,
  child: SaSelectOption,
}))
