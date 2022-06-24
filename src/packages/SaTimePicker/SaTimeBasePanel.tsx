import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { TimePublicProps } from "./saTimePicker.utils";


export const SaTimeBasePanel = designComponent({

  name: 'sa-time-base-panel',

  props: {
    modelValue: { type: String },
    ...TimePublicProps
  },

  emits: {
    onUpdateModelValue: (val: string | null) => true,
  },

  setup({ props, event }) {

    return {
      render: () => <div>
        22
      </div>
    }
  }
})

export default SaTimeBasePanel