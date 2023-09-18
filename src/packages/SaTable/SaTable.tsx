import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { PropType } from "vue";
import SaTableColumn from "../SaTableColumn/SaTableColumn";
import SaTbody from './SaTbody'
import SaThead from './SaThead'
import './saTable.scss'

import { classname, useCollect, useRefs } from "src/hooks";
import { computed, VNode } from "@vue/runtime-core";
import { TabelStyle } from "./cros/table.type";
import { useTable } from "./use/useTable";

const SaTable = designComponent({
  name: 'sa-table',

  props: {
    data: { type: Array },                                                                  // 表格绑定值
    border: { type: Boolean, default: true },                                               // 表格的边框
    tableStyle: { type: Object as PropType<TabelStyle> },                                   // 自定义表格样式
    rowKey: { type: String }                                                                // 没有默认绑定自定义key（_id）
  },

  slots: ['default'],

  setup({ props, slots }){

    const { onRef, refs } = useRefs({
      table: HTMLTableElement,
      tbody: HTMLElement
    })

    const { methods: TableMethods, state } = useTable()

    SaTableCollect.parent()
    
    const tableRows = computed(() => {
      return (slots.default() as any).map((row: VNode, i: number) => ({
        $index: i,
        row
      }))
    })

    const tableClasses = computed(() => classname([
      'sa-table',
      {
        'sa-table-border': props.border
      }
    ]))

    const methods = {
      getTableRow: (index: number) => tableRows.value[index].prop
    }

    return {
      refer: {
        refs,
        props,
        methods
      },

      render: () => (
        <div class={ tableClasses.value }>

          <table ref={ onRef.table }>
            <SaThead 
              thRows={ tableRows.value }
              style={props.tableStyle?.thead}
              selectAll={ state.selectAll }
            />

            <SaTbody
              ref={ onRef.tbody }
              class="sa-tbody"
              style={ props.tableStyle?.tbody }
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