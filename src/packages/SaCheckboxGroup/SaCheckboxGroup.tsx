import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus, DEFAULT_STATUS, EditProps, StyleProps, useCollect, useEdit, useModel, useNumber, useRefs, useStyle } from "src/hooks";
import { PropType, computed } from "vue";
import SaCheckbox from '../SaCheckbox/SaCheckbox'

export const SaCheckboxGroup = designComponent({
  name: 'sa-checkbox-group',

  props: {
    ...EditProps,
    ...StyleProps,
    
    modelValue: { type: Array as PropType<(number | string)[]> },

    min: {type: Number},  // 最少选项
    max: {type: Number}, // 最大选项
  },

  inheritPropsType: HTMLDivElement, // 继承DIV元素本身的类型

  slots: ['default'],

  emits: {
    onUpdateModelValue: (val: (string | number)[] | undefined) => true,
  },

  setup({ props, event: { emit }, slots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const { refs, onRef } = useRefs({
      el: HTMLDivElement
    })

    const { editComputed } = useEdit()
    
    useStyle({status: DEFAULT_STATUS})

    // 格式化min、max属性
    const { numberState } = useNumber(props, ['min', 'max'])

    const child = CheckboxGroupCollector.parent()
    
    const activeChild = computed(() => child.filter(({innerStatus: {props: {checkboxForAll, customReadonly}}}) => !checkboxForAll && !customReadonly))
    
    const allKeys = computed(() => activeChild.value.map(({innerStatus: { props: { value } }}) => value))

    // 当前状态
    const checkStatus = computed(() => {
      let hasCheck = false
      let hasunCheck = false

      if(!model.value) {
        return CheckboxStatus.uncheck
      }

      console.log(activeChild.value);
      

      activeChild
        .value
        .forEach(c => model.value!.indexOf(c.innerStatus.props.value!) > -1 ? hasCheck = true : hasunCheck = true)


      if(hasCheck && !hasunCheck) {
        return CheckboxStatus.check
      }

      if(!hasCheck && hasunCheck) {
        return CheckboxStatus.uncheck
      }

      return CheckboxStatus.minus
    })

    const utils = {
      getCheckStatus: (checkbox: typeof SaCheckbox.use.class): CheckboxStatus => {
        const { innerStatus: { props: { checkboxForAll, value } } } = checkbox
        if(checkboxForAll) {
          return checkStatus.value
        } else {
          return !!model.value && model.value.indexOf(value!) > -1 ? CheckboxStatus.check : CheckboxStatus.uncheck
        }
      },

      exceed: {
        max: (val:(number | string)[] | undefined) => {
          if(numberState.max == null) {
            return false
          }

          return !!val && val.length > numberState.max
        },

        min: (val: (number | string)[] | undefined) => {
          if(numberState.min == null) {
            return false
          }

          return !val || val.length < numberState.min
        }
      },

      changeValue: {
        add: (val: (number | string)[]) => { 
          utils.exceed.max(val) ? console.error(`最多可选${numberState.max}个选项`) : (model.value = val)
          
        },

        del: (val: (number | string)[]) => {
          utils.exceed.min(val) ? console.error(`最少选择${numberState.min}个选项`) : (model.value = val)
        }
      }
    }

    const handler = {
      clickCheckbox: (checkbox: typeof SaCheckbox.use.class) => {
        if(!editComputed.value.editable) {
          return
        }

        const { innerStatus: { props: { value, checkboxForAll } } } = checkbox

        // 处理全选逻辑
        if(checkboxForAll) { // ---- 必须是当前唯一全选按钮
          if(checkStatus.value !== CheckboxStatus.check) { // 没有选中的情况下 改变状态 -- > 全选
            utils.changeValue.add([...allKeys.value as string[]])
          } else { // 选中的情况下改变状态 --- > 取消全选
            utils.changeValue.del([])
          }

          return 
        }

        if(value === null) {
          throw new Error('Checkbox: value is necessary when Checkbox in CheckboxGroup')
        }

        if(!model.value) {
          return utils.changeValue.add([value!])
        }

        const valArr = [...model.value]
        const index = valArr.indexOf(value!)
        

        index > -1 ? (
          valArr.splice(index, 1), // 删除取消选者的val
          utils.changeValue.del(valArr)
        ) : utils.changeValue.add([...valArr, value!])
      }
    }

    return {
      refer: {
        refs,
        props,
        numberState,
        utils,
        handler
      },

      render: () => <div class="sa-checkbox-group" ref={ onRef.el }>
        { slots.default() }
      </div>
    }
  }
})

export const CheckboxGroupCollector = useCollect(() => ({
  parent: SaCheckboxGroup,
  child: SaCheckbox
}))

export default SaCheckboxGroup