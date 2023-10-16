import { computed, PropType, reactive, watch } from "vue";
import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { CheckboxStatus } from "src/hooks";

import SaCheckbox from "../SaCheckbox/SaCheckbox";
import SaIcon from '../SaIcon/SaIcon'
import { SortableStatusEnum, TableColumnRow } from "./cros/table.type";


const SaThead = designComponent({
  name: 'sa-thead',

  props: {
    thRows: { type: Array as PropType<TableColumnRow[]>, default: [] },                 // row 数组
    selectAll: { type: String as PropType<CheckboxStatus> },                            // 是否全局选中
    sortableIndexs: { type: Array as PropType<number[]> }                               // 开启排序表头索引
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

    const handler = {
      clickSort: (e: MouseEvent, index: number, prop: string) => {
        if(!props.sortableIndexs?.includes(index)) {
          return
        }

        e.stopPropagation()

        const curStatus = state.sortIndexStatus[index]

        Object.keys(state.sortIndexStatus).forEach(k => state.sortIndexStatus[k] = null) // 保证排序的唯一性

        state.sortIndexStatus[index] = (!curStatus || curStatus === SortableStatusEnum.Desc ) 
        ? SortableStatusEnum.Asce 
        : SortableStatusEnum.Desc

        emit.onSortable(
          state.sortIndexStatus[index]!,
          prop
        )
      }
    }

    watch(() => props.sortableIndexs, () => {

      if(props.sortableIndexs && props.sortableIndexs.length > 0) {
        props.sortableIndexs.forEach(index => ({ [ `${index}`]: null }))
      }
    }, { deep: true, immediate: true })

    return {
      render: () => (
        <thead>
          {
            props
              .thRows
              .map((c: TableColumnRow, i: number) => (
                <th style={{ width: `${c.props.width}`.indexOf('px') > -1 ? c.props.width : `${c.props.width}px`, textAlign: c.props.align }}>
                  <div 
                    class={ 
                      `sa-table-item sa-table-head ${ props.sortableIndexs?.includes(i) ? ' sa-table-head--sortable' : '' } ${ !!state.sortIndexStatus[i] ? 'sa-' + state.sortIndexStatus[i] : '' }` 
                    } 
                    style={{ textAlign: c.props.align }}
                    onClick={ e => handler.clickSort(e, i, c.props.prop) }
                  >
                    {
                      c.props.selected ? (
                        <SaCheckbox checkStatus={ props.selectAll } onChangeStatus={ (e: CheckboxStatus) => emit.onCheckAll(e) } /> 
                      ) : <>
                        { c.props.label }
                        {
                          props.sortableIndexs?.includes(i) && (
                            <span class="caret-wrapper">
                              <SaIcon icon="el-icon-caret-top" size={ 16 } class="sort-caret ascending"></SaIcon>
                              <SaIcon icon="el-icon-caret-bottom" size={ 16 } class="sort-caret descending"></SaIcon>
                            </span>
                          )
                        }
                      </>
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