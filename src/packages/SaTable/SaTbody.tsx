import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed, ref, watch } from "vue";
import SaTable from './SaTable'

const SaTbody = designComponent({
  props: {
    layout: { type: Object },
    clickIndex: { type: Number }
  },

  slots: ['default'],

  emits: {

  },

  setup({ props, slots }) {

    let clickIndex = ref<number>(-1)

    const table = SaTable.use.inject(null)!

    const layoutLen = computed(() => new Array(props.layout?.trLen || 0).fill(''))

    const handler = {
      handleClick: (e: MouseEvent, i: number) => {
        e.stopPropagation()

        if(table.props.highlightCurrentRow) {
          clickIndex.value = i
        }

        table.handler.handleRowClick(i)
      }
    }

    watch(() => props.clickIndex, () => clickIndex.value = props.clickIndex!)

    return {
      render: () => (

        <tbody>
          {
            layoutLen.value.map((c, i) => (
              <tr class={
                `sa-table-column--hover ${ clickIndex.value === i ? 'sa-table-column--click' : '' }`
              } onClick={(e) => handler.handleClick(e, i)}>
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