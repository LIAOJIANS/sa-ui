import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useRefs } from "src/hooks";
import { SelectCollector } from "../SaSelect/SaSelect";


export const SaSelectOption = designComponent({
  name: 'sa-select-option',

  props: {
    label: { type: [String, Number], required: true },
    val: { type: [String, Number], required: true },
    icon: { type: String },
    disabled: { type: Boolean },

    group: { type: Boolean },
  },

  setup({ props }) {
    const { refs, onRef } = useRefs({
      el: HTMLDivElement
    })

    SelectCollector.child({ injectDefaultValue: null, sort: () => refs.el! })

    return {
      render: () => <div
        {...{
          ref: onRef.el,
          label: props.label,
          val: props.val,
          icon: props.icon
        }} />
    }
  }
})