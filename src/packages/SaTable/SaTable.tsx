import { designComponent } from "src/advancedComponentionsApi/designComponent";
import SaTableColumn from "../SaTableColumn/SaTableColumn";
import SaTbody from './SaTbody'
import SaThead from './SaThead'
import './saTable.scss'

import { useCollect, useRefs } from "src/hooks";
import { computed, VNode } from "@vue/runtime-core";
import { ColumnProp } from "./cros/table.type";

const SaTable = designComponent({
  name: 'sa-table',

  props: {
    data: { type: Array },                                                                  // 表格绑定值
  },

  slots: ['default'],

  setup({ props, slots }){

    const { onRef, refs } = useRefs({
      table: HTMLTableElement,
      tbody: HTMLElement
    })

    const parent = SaTableCollect.parent()
    
    const tableRows = computed(() => {
      return (slots.default() as any).map((row: VNode) => row.props)
    })

    const methods = {
      getTableRow: (index: number) => tableRows.value[index].prop,
      
      getThTitles: () => tableRows.value.map((c: ColumnProp) => c.label)
    }

    return {
      refer: {
        refs,
        props,
        methods
      },

      render: () => (
        <div class="sa-table">
          <table ref={ onRef.table }>
            <SaThead 
              thRows={ methods.getThTitles() }
            />

            <SaTbody
              ref={ onRef.tbody }
              class="sa-tbody"
              layout={{
                trLen: props.data?.length,
                tdLen: tableRows.value.length
              }}
            >
              { slots.default() }
            </SaTbody>
          </table>
        </div>
      )
    }
  }
})


export const SaTableCollect = useCollect(() => ({
  parent: SaTable,
  child: SaTableColumn
}))

export default SaTable