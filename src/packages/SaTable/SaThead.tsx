import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { PropType } from "vue";

const SaThead = designComponent({
  name: 'sa-thead',

  props: {
    thRows: { type: Array as PropType<string[]>, default: [] }
  },

  setup({ props }) {

    return {
      render: () => (
        <thead>
          {
            props
              .thRows
              .map((c: string) => (
                <th>{c}</th>
              ))
          }
        </thead>
      )
    }
  }
})

export default SaThead