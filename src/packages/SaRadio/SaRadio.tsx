import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { SimpleFunction } from "src/advancedComponentionsApi/emit";
import './SaRadio.scss'
import { CheckboxStatus, DEFAULT_STATUS, useEdit, useModel, useRefs, useStyle } from "src/hooks";
import { computed, PropType, Transition } from "vue";
import SaRadioGroup from "../SaRadioGroup/SaRadioGroup";
import SaRadioInner from '../SaRadioInner/SaRadioInner'

export const SaRadio = designComponent({
  name: 'Sa-Radio',

  props: {
    modelValue: {},
    label: { type: String },
    value: { type: [Number, String, Boolean] },
    readonly: { type: Boolean },
    trueValue: { default: true },
    falseValue: { default: false },
    checkStatus: { type: String as PropType<CheckboxStatus.check | CheckboxStatus.uncheck> }
  },

  emits: {
    onUpdateModelValue: (val: any) => true,
    onClick: (e?: MouseEvent) => true
  },

  scopeSlots: {
    radioDefault: (scope: { checked: boolean, status: CheckboxStatus.check | CheckboxStatus.uncheck, click: SimpleFunction }) => { }
  },

  slots: ['default'],

  setup({ props, event: { emit }, scopeSlots, slots }) {

    const group = SaRadioGroup.use.inject(null)
    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
    const { editComputed } = useEdit()
    const { styleComputed } = useStyle({ status: DEFAULT_STATUS })
    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })

    const checkStatus = computed(() => {

      if (!!props.checkStatus) {
        return props.checkStatus
      }

      if (!!group) {
        return group.utils.getCheckStatus(props.value)
      } else {
        return model.value === props.trueValue ? CheckboxStatus.check : CheckboxStatus.uncheck
      }
    })

    const classes = computed(() => [
      'sa-radio',
      `sa-radio-status-${styleComputed.value.status}`,
      `sa-radio-size-${styleComputed.value.size}`,
      {
        'sa-radio-checked': checkStatus.value === CheckboxStatus.check,
        'sa-radio-disabled': editComputed.value.disabled,
      },
    ])

    const handler = {
      click: (e?: MouseEvent) => {
        if (!!e) {
          e.stopPropagation()
        }
        
        emit.onClick(e)
        if (!editComputed.value.editable || props.readonly) {
          return
        }
        
        if (!!group) {
          
          group.handler.onClickRadio(props.value)
        } else {
          model.value = checkStatus.value === CheckboxStatus.check ? props.falseValue : props.trueValue
        }

        if (!!e) {
          e.stopPropagation()
          e.preventDefault()
        }
      }
    }

    return {
      refer: {
        refs
      },
      render: () => {
        
        return scopeSlots.radioDefault({
          checked: checkStatus.value === CheckboxStatus.check,
          status: checkStatus.value,
          click: handler.click,
        }, (
          <div
            class={classes.value}
            ref={onRef.el}
            tabindex={0}
            onClick={handler.click}
          >
            <span class="plain-click-node">
              <Transition name="sa-transition-fade" mode="out-in">
                <SaRadioInner checkStatus={checkStatus.value} key={checkStatus.value} />
              </Transition>
            </span>

            {<span class="sa-radio-label">{ !!props.label ?  props.label : slots.default()}</span>}

          </div>
        ))
      }
    }
  }
})

export default SaRadio