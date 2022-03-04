import { designComponent } from "src/advancedComponentionsApi/designComponent";

export const SaMessageManager = designComponent({
  name: 'SaMessageManager',

  props: {
    name: {required: true},
    Component: {required: true},
  },


  setup({ props }) {
    return {
      refer: {
        props
      },
      render: () => <div class="sa-message-manager">

      </div>
    }
  }
})

export default SaMessageManager