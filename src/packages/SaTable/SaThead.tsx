import { computed, PropType, reactive, watch } from "vue";
import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus, classname } from "src/hooks";

import SaCheckbox from "../SaCheckbox/SaCheckbox";
import SaIcon from '../SaIcon/SaIcon'
import { FixedStatusEnum, SortableStatusEnum, TableAlignEnum, TableColumnRow } from "./cros/table.type";

const SaThead = designComponent({
  name: 'sa-thead',

  props: {
    thRows: { type: Array as PropType<TableColumnRow[]>, default: [] },                 // row 数组
    selectAll: { type: String as PropType<CheckboxStatus> },                            // 是否全局选中
    funPropIndexs: { type: Object as PropType<Record<string, number[]>> }               // 开启排序表头索引
  },

  emits: {
    onCheckAll: (e: CheckboxStatus) => true,
    onSortable: (sortStatus: SortableStatusEnum, prop: String) => true
  },

  setup({ props, event: { emit } }) {

    const state = reactive({
      sortIndexStatus: {}
    } as {
      sortIndexStatus: Record<string, SortableStatusEnum | null>
    })

    const sortableIndexs = computed(() => props.funPropIndexs!.sortables)

    const handler = {
      clickSort: (e: MouseEvent, index: number, prop: string) => {
        if (!sortableIndexs.value?.includes(index)) {
          return
        }

        e.stopPropagation()

        const curStatus = state.sortIndexStatus[index]

        Object.keys(state.sortIndexStatus)
          .forEach(k => state.sortIndexStatus[k] = null) // 保证排序的唯一性

        state.sortIndexStatus[index] = (!curStatus || curStatus === SortableStatusEnum.Desc)
          ? SortableStatusEnum.Asce
          : SortableStatusEnum.Desc

        emit.onSortable(
          state.sortIndexStatus[index]!,
          prop
        )
      },

      fixedAlgin(fixed: FixedStatusEnum, algin: TableAlignEnum) {
        return classname([
          'sa-table-cell',
          {
            'sa-table-cell--fixed': !!fixed,
            [`sa-table-cell--fixed-${fixed}`]: !!fixed,
            [`sa-table-algin-${algin}`]: !!algin
          }
        ])
      },

      tableHeadClass(i: number) {
        return classname([
          'sa-table-item',
          'sa-table-head',
          {
            'sa-table-head--sortable': sortableIndexs.value?.includes(i),
            [`sa-${state.sortIndexStatus[i]}`]: !!state.sortIndexStatus[i]
          }
        ])
      }
    }

    watch(() => sortableIndexs.value, () => {

      if (sortableIndexs.value && sortableIndexs.value.length > 0) {
        sortableIndexs.value.forEach(index => ({ [`${index}`]: null }))
      }
    }, { deep: true, immediate: true })

    return {
      render: () => (
        <thead>
          <tr>
            {
              props
                .thRows
                .map((c: TableColumnRow, i: number) => (
                  <th
                    class={handler.fixedAlgin(c.props.fixed, c.props.align!)}
                  >
                    <div
                      class={handler.tableHeadClass(i)}
                      onClick={e => handler.clickSort(e, i, c.props.prop)}
                    >
                      {
                        c.props.selected ? (
                          <SaCheckbox checkStatus={props.selectAll} onChangeStatus={(e: CheckboxStatus) => emit.onCheckAll(e)} />
                        ) : <>
                          {c.props.label}
                          {
                            sortableIndexs.value?.includes(i) && (
                              <span class="caret-wrapper">
                                <SaIcon icon="el-icon-caret-top" size={16} class="sort-caret ascending"></SaIcon>
                                <SaIcon icon="el-icon-caret-bottom" size={16} class="sort-caret descending"></SaIcon>
                              </span>
                            )
                          }
                        </>
                      }
                    </div>
                  </th>
                ))
            }
          </tr>
        </thead>
      )
    }
  }
})

export default SaThead