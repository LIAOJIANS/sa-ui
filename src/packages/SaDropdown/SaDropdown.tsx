import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useModel, useRefs } from "src/hooks";
import SaPopper from "../SaPopper/SaPopper";
import './dropdown.scss'

export const SaDropdown = designComponent({
  name: 'sa-dropdown',
  props: {
    modelValue: { type: Boolean },
    trigger: { type: String, default: 'click' },
    isClickOptionHide: { type: Boolean, default: false }
  },
  inheritPropsType: SaPopper,
  provideRefer: true,
  emits: {
    onUpdateModelValue: (val: boolean) => true
  },

  slots: ['popper', 'default'],

  scopeSlots: {
    reference: (scope: { open?: boolean }) => { },
  },
  setup({ props, event: { emit }, slots, scopeSlots }) {
    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
    const { onRef, refs } = useRefs({
      popper: SaPopper
    })
    
    const handler = {
      clickDropdownOption: (e: MouseEvent) => {
        if (!props.isClickOptionHide) {
          model.value = false
        }
      }
    }
    
    return {
      refer: {
        handler,
        refs
      },
      render: () => (
        <SaPopper
          v-model={model.value}
          ref={onRef.popper}
          tirgger={props.trigger}
          transition="sa-transition-popper-drop"
          noContentPadding
          v-slots={{
            popper: () => slots.popper(),
            default: () => scopeSlots.reference({open: model.value}, slots.default())
          }}
        />
      )
    }
  }
})

export default SaDropdown