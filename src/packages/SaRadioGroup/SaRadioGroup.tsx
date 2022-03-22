import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus, EditProps, StyleProps, useModel, useRefs } from "src/hooks";

export const SaRadioGroup = designComponent({

  name: 'sa-radio-group',

  props: {
    ...EditProps,
    ...StyleProps,

    modelValue: {}
  },

  slots: ['default'],

  emits: {
    onUpdateModelValue: (val: any) => true
  },

  inheritPropsType: HTMLDivElement,
  provideRefer: true,

  setup({ slots, props, event: { emit } }) {

    // const formItem = inject('@@sa-from-item', null)   -----  对应的form多层组件通信

    const { onRef, refs } = useRefs({
      el: HTMLDivElement
    })
    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

    const utils = {
      getCheckStatus: (val: any) => {
        return model.value === val ? CheckboxStatus.check : CheckboxStatus.uncheck
      }
    }

    const handler = {
      onClickRadio: (val: any) => {
        model.value = val
      }
    }

    return {
      refer: {
        refs,
        props,
        utils,
        handler
      },

      render: () => <div
        ref={onRef.el}
        class="sa-radio-group"
      >
        {slots.default()}
      </div>
    }
  }
})

export default SaRadioGroup