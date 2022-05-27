import { designComponent } from "src/advancedComponentionsApi/designComponent";
import './SaDialog.scss'

export const SaDialog = designComponent({
  name: 'sa-dialog',

  props: {
    modelValue: { type: Boolean },
    width: { type: [Number, String] },

    transition: { type: String, default: 'sa-transition-dialog' },
  },

  setup({ props }) {
    return {
      render: () => <div class=''>
        SaDialog
      </div>
    }
  }
})

export default SaDialog