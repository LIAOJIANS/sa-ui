import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus } from "src/hooks";
import { computed, PropType, watch } from "vue";
import SaCheckbox from "../SaCheckbox/SaCheckbox";
import { TableColumnRow } from "./cros/table.type";

const SaThead = designComponent({
  name: 'sa-thead',

  props: {
    thRows: { type: Array as PropType<TableColumnRow[]>, default: [] },   // row 数组
    selectAll: { type: String as PropType<CheckboxStatus> }               // 是否全局选中
  },

  setup({ props }) {

    return {
      render: () => (
        <thead >
          {
            props
              .thRows
              .map((c: TableColumnRow) => (
                <th>
                  <div class="sa-table-item sa-table-head" style={{ textAlign: c.row.props.align }}>
                    {
                      c.row.props.selected ? (
                        <SaCheckbox checkStatus={ props.selectAll } /> 
                      ) : c.row.props.label
                    }
                  </div>
                </th>
              ))
          }
        </thead>
      )
    }
  }
})

export default SaThead