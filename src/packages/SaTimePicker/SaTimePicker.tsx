import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { VueNode } from "src/advancedComponentionsApi/designComponent.utils";
import { PropType } from "vue";
import { TimePickerProps, TimeRangePanelType } from "./saTimePicker.utils";

export const SaTimePicker = designComponent({

  name: 'sa-time-picker',

  props: {
    ...TimePickerProps,
    footer: {type: Function as PropType<() => VueNode>}
  },

  emits: {
    onUpdateModelValue: (val: string | undefined, type: TimeRangePanelType) => true,
    onUpdateStart: (val?: string) => true,
    onUpdateEnd: (val?: string) => true
  },

  setup({ props, event: { emit } }) {

    return {
      render: () => <div>
        sa-time-picker
      </div>
    }
  }
})

export default SaTimePicker
