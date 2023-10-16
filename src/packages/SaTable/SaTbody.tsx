import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, watch } from "vue";
import SaTable from './SaTable'

const SaTbody = designComponent({
  props: {
    layout: { type: Object }
  },

  slots: ['default'],

  emits: {

  },

  setup({ props, slots }) {

    const table = SaTable.use.inject(null)!

    const layoutLen = computed(() => new Array(props.layout?.trLen || 0).fill(''))

    const handler = {
      handleClick: (e: MouseEvent, i: number) => {
        e.stopPropagation()

        table.handler.handleRowClick(i)
      }
    }

    return {
      render: () => (

        <tbody>

          {
            layoutLen.value.map((c, i) => (
              <tr class="sa-table-column--hover" onClick={(e) => handler.handleClick(e, i)}>
                {slots.default()}
              </tr>
            ))
          }
        </tbody>
      )
    }
  }
})

export default SaTbody