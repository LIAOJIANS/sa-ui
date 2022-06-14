import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { VueNode } from "src/advancedComponentionsApi/designComponent.utils";
import { PropType } from "vue";
import { TimeRangePanelType } from "./saTimePicker.utils";

export const TimePickerProps = {
  modelValue: { type: String },
  start: { type: [String, Number] },
  end: { type: [String, Number] },
  range: { type: Boolean }
}

export const SaTimePicker = designComponent({

  name: 'sa-time-picker',

  props: {
    ...TimePickerProps,

    footer: {type: Function as PropType<() => VueNode>}
  },

  emits: {
    onUpdateModelValue: (val: string | undefined, type: TimeRangePanelType) => true,
    onUpdateStart: (val?: string) => true,
    onUpdateEnd: (val?: string) => true,

  },

  setup({ props }) {

    return {
      render: () => <div>
        timerPicker
      </div>
    }
  }
})

export default SaTimePicker