import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { getElement, useRefs } from "src/hooks";
import { computed } from "vue";
import { SaTableCollect } from "../SaTable/SaTable";

const SaTableColumn = designComponent({
  name: 'sa-table-column',
  props: {
    label: { type: String },                                                   // 表名标题
    prop: { type: String },                                                    // 绑定的指
  },

  scopeSlots: {
    default: (row: any) => { }
  },

  setup({ props, scopeSlots }) {
    const { onRef, refs } = useRefs({
      tableColumn: HTMLElement
    })

    const group = SaTableCollect.child()

    const tableRow = computed(() => {
      const childrens = getElement(group.refs.tbody)?.children || []

      if(childrens.length < 1) {
        return {}
      }

      const index = methods.getColumnIndex(childrens, refs.tableColumn?.parentElement)
      
      return group.props.data![index]
    
    })

    const methods = {
      getColumnIndex: (
        childrens: any,
        child: any
      ) => [].indexOf.call(childrens, child as never)
    }
    
    return {
      render: () => <td ref={ onRef.tableColumn } style={{ display: 'inline-block' }}>
        <div>
          {
            scopeSlots.default(tableRow.value,
              <span>{ (tableRow.value as any)[props.prop!] }</span>
            )
          }
        </div>
      </td>
    }
  }
})

export default SaTableColumn