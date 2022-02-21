import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus, classname, DEFAULT_STATUS, EditProps, StyleProps, useEdit, useModel, useRefs, useStyle } from "src/hooks";
import { computed, Transition } from "vue";
import { SaCheckboxInner } from '../SaCheckboxInner/SaCheckboxInner'
import './SaCheckbox.scss'

export const SaCheckbox = designComponent({
  name: 'sa-checkbox',

  props: {
    ...EditProps,
    ...StyleProps,

    modelValue: {},
    tureValue: { default: true as any },
    falseValye: { default: false as any },
    label: { type: String }
  },

  emits: {
    onUpdateModelValue: (val: any) => true,
    onClick: (e?: MouseEvent) => true
  },

  scopeSlots: {
    default: (scope: {}) => { }
  },

  slots: ['defalut'],

  setup({ props, event: { emit }, slots, scopeSlots }) {

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const { editComputed } = useEdit()
    const { styleComputed } = useStyle({ status: DEFAULT_STATUS })

    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })
    const refer = { refs, innerStatus: { props, editComputed } }

    const checkStatus = computed((): CheckboxStatus => model.value === props.tureValue ? CheckboxStatus.check : CheckboxStatus.uncheck)

    const classes = computed(() => classname([
      'sa-checkbox',
      `sa-checkbox-status-${styleComputed.value.status}`,
      `sa-checkbox-size-${styleComputed.value.size}`,
      `sa-checkbox-check-status-${checkStatus.value}`,
      { 'sa-checkbox-disabled': editComputed.value.disabled },
    ]))

    const handler = {
      clickEl: (e?: MouseEvent) => {
        if(!!e) {
          e.stopPropagation()
        }
        emit.onClick(e)

        if(editComputed.value.editable || props.customReadonly) {
          return
        }

        model.value = checkStatus.value === CheckboxStatus.check ? props.falseValye : props.tureValue
      }
    }

    return {
      refer,
      render: () => scopeSlots.default({
        checked: checkStatus.value === CheckboxStatus.check,
        status: checkStatus.value,
        click: handler.clickEl
      }, (<div
        ref={onRef.el}
        class={classes.value}
      >
        <span class="plain-click-node">
          <Transition name="sa-transition-fade" mode="out-in">
            <SaCheckboxInner
              checkStatus={checkStatus.value}
              key={checkStatus.value}
              disabled={editComputed.value.disabled!}
            >

            </SaCheckboxInner>
          </Transition>
        </span>
        {(slots.defalut.isExist() || props.label) && slots.defalut(<span class="sa-checkbox-label"> {props.label} </span>)}
      </div>))
    }
  }
})

export default SaCheckbox