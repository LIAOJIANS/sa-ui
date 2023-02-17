import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus, classname, DEFAULT_STATUS, EditProps, StyleProps, unit, useEdit, useModel, useRefs, useStyle, useStyles } from "src/hooks";
import { SimpleFunction } from "src/hooks/utils/event";
import { computed, Transition, watch } from "vue";
import { CheckboxGroupCollector } from "../SaCheckboxGroup/SaCheckboxGroup";
import { SaCheckboxInner } from '../SaCheckboxInner/SaCheckboxInner'
import './SaCheckbox.scss'

export const SaCheckbox = designComponent({
  name: 'sa-checkbox',

  props: {
    ...EditProps,
    ...StyleProps,

    modelValue: {},
    checkStatus: { type: String },  // 自定义状态
    value: { type: [String, Number] },
    tureValue: { default: true as any },
    falseValue: { default: false as any },
    label: { type: String },
    checkboxForAll: { type: Boolean },
  },

  emits: {
    onUpdateModelValue: (val: any) => true,
    onClick: (e?: MouseEvent) => true,
    onChangeStatus: (val: any) => true
  },

  scopeSlots: {
    content: (scope: { checked: boolean, status: keyof typeof CheckboxStatus, click: SimpleFunction }) => { }
  },

  slots: ['default'],

  inheritPropsType: HTMLDivElement,

  setup({ props, event: { emit }, slots, scopeSlots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const { editComputed } = useEdit()
    const { styleComputed } = useStyle({ status: DEFAULT_STATUS })

    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })
    const refer = { refs, innerStatus: { props, editComputed } }

    const checkboxGroup = CheckboxGroupCollector.child({ injectDefaultValue: null })

    const checkStatus = computed((): CheckboxStatus => { // 选中状态

      if (!!props.checkStatus) {
        return props.checkStatus as CheckboxStatus
      }

      if (!!checkboxGroup) {
        return checkboxGroup.utils.getCheckStatus(refer)
      } else {

        return model.value === props.tureValue ? CheckboxStatus.check : CheckboxStatus.uncheck
      }

    })

    const classes = computed(() => classname([
      'sa-checkbox',
      `sa-checkbox-status-${styleComputed.value.status}`,
      `sa-checkbox-size-${styleComputed.value.size}`,
      `sa-checkbox-check-status-${checkStatus.value}`,
      { 'sa-checkbox-disabled': editComputed.value.disabled },
    ]))

    const handler = {
      clickEl: (e?: MouseEvent) => {
        if (!!e) {
          e.stopPropagation()
        }

        emit.onClick(e)

        if (!editComputed.value.editable || props.customReadonly) {
          return
        }

        if (!!checkboxGroup) {
          return checkboxGroup.handler.clickCheckbox(refer)
        }
        
        model.value = checkStatus.value === CheckboxStatus.check ? props.falseValue : props.tureValue
        
        if (!!e) {
          e.stopPropagation()
          e.preventDefault()
        }
      }
    }

    watch(() => model.value, (isCheck) => emit.onChangeStatus(isCheck === props.tureValue ? CheckboxStatus.check : CheckboxStatus.uncheck))

    const styles = useStyles(style => {
      if(!!checkboxGroup) {
        style.marginLeft = unit(10)
      }

      return style
    })

  
    return {
      refer,
      render: () => scopeSlots.content({
        checked: checkStatus.value === CheckboxStatus.check,
        status: checkStatus.value,
        click: handler.clickEl
      }, (<div
        ref={onRef.el}
        class={classes.value}
        style={{ ...styles.value, ...props.style as any }}
        onClick={handler.clickEl}
      >
        <span class="plain-click-node">
          <Transition name="sa-transition-fade" mode="out-in">
            <SaCheckboxInner
              checkStatus={checkStatus.value}
              key={checkStatus.value}
              disabled={editComputed.value.disabled!}
            />
          </Transition>
        </span>
        {<span class="sa-checkbox-label">{props.label ? props.label : slots.default()} </span>}
      </div>))
    }
  }
})

export default SaCheckbox