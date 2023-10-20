import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { PropType, toRaw, watch } from "vue";
import SaTableColumn from "../SaTableColumn/SaTableColumn";
import SaTbody from './SaTbody'
import SaThead from './SaThead'
import './saTable.scss'

import { CheckboxStatus, classname, unit, useCollect, useRefs, useStyles } from "src/hooks";
import { computed, VNode } from "@vue/runtime-core";
import { ColumnProp, SpanMethods, TabelStyle, TableColumnRow } from "./cros/table.type";
import { useTable } from "./use/useTable";
import { typeOf } from "js-hodgepodge";

const SaTable = designComponent({
  name: 'sa-table',

  props: {
    data: { type: Array },                                                                  // 表格绑定值
    border: { type: Boolean, default: false },                                              // 表格的边框
    tableStyle: { type: Object as PropType<TabelStyle> },                                   // 自定义表格样式
    rowKey: { type: String },                                                               // 没有默认绑定自定义key（_id）
    spanMethods: { type: Function as PropType<SpanMethods> },                               // 用于合并表格行列单元格
    selectCache: { type: Boolean },                                                         // 只有当表格是select状态下才适用，用于是否缓存选择之后的数据
    maxHeight: { type: [ Number, String ] },                                                // 表格table最大高度
    minHeight: { type: [ Number, String ] },                                                // 表格table最小高度
    highlightCurrentRow: { type: Boolean },                                                 // 高亮当前点击行
    zebra: { type: Boolean },                                                               // 开启偶数斑马行
  },

  slots: ['default'],

  provideRefer: true,

  emits: {
    onClickRow: (row: TableColumnRow) => true,

    onUpdateModelValue: (val: any[]) => true,
  },

  setup({ props, slots, event: { emit } }) {

    const { onRef, refs } = useRefs({
      table: HTMLTableElement,
      tbody: HTMLElement
    })

    const { methods: tableMethods, handler: tableHandle, state, tableData, exposeMethods } = useTable(props.data! as any, props)

    SaTableCollect.parent()

    // const selects = computed(() => childs.filter(({ props: c }) => c.selected).map(({ props: c }) => c))

    const funPropIndexs = computed(() => {
      const sortables: number[] = []
      
      const fixedes: number[] = []

      ;(slots.default() as any).forEach(({ props: c }: { props: ColumnProp }, index: number) => {
        if(!!c.sortable) {
          sortables.push(index)
        }

        if(!!c.fixed) {
          fixedes.push(index)
        }
      })
      
      return {
        sortables,
        fixedes
      }
    })

    const tableRows = computed(() => {
      return (slots.default() as any).map((row: VNode, i: number) => ({
        rowIndex: i,
        props: row.props
      }))
    })
    
    const stayles = useStyles(style => {

      if(!!props.minHeight || !!props.maxHeight) {
        style.overflow = 'auto'
      }
      
      if (!!props.maxHeight) {
        style.maxHeight = unit(props.maxHeight)
      }

      if (!!props.minHeight) {
        style.minHeight = unit(props.minHeight)
      }
    })


    const tableClasses = computed(() => classname([
      'sa-table',
      {
        'sa-table-border': props.border
      }
    ]))

    const methods = {
      getTableRow: (index: number) => tableRows.value[index].prop,

      checkStautsCheck: (e: CheckboxStatus, checkId: string) => {

        tableMethods
          .setCheck(
            e,
            checkId,
            props.data?.length || 0
          )
      },

      getCheckedRaw: () => exposeMethods.getCheckedRaw(),

      getCheckByKey: () => {
        if (!props.rowKey) {
          console.error('Please set the Key, otherwise use the internal key!')
        }

        return state.checks
      },

      setCheckByRawKeys: (keys: any, status?: boolean) => exposeMethods.setCheckByRawKeys(keys, status),

      setCheckByRaws: (row: any, status?: boolean) => { // 传参类型---数组则批量添加，单个子直接追加

        if (!props.rowKey) {
          return console.error('Must be bound RawKey!!!')
        }

        const key = tableMethods.getRawKey()

        if (typeOf(row) !== 'array') {
          row = [row]
        }

        methods
          .setCheckByRawKeys(
            row.map((c: any) => c[key]),
            status
          )
      },

      setCurrentRow: (row: any) => {
        if (!props.rowKey) {
          return console.error('Must be bound RawKey!!!')
        }

        if(typeOf(row) !== 'object') {
          return console.error('Please pass in the correct row!!!')
        }

        if(!props.highlightCurrentRow) {
          return console.error('Please enable the highlightCurrentRow property!!!')
        }

        const key = tableMethods.getRawKey()

        const index = state.tableData.findIndex(c => c['_id'] === row[key])
        
        tableMethods
          .setCurrentRow(index)
          
      }
    }

    const handler = {
      handleRowClick: (index: number) => {
        const row = state.tableData[index]

        tableMethods
          .setCurrentRow(index)

        emit.onClickRow(toRaw(row))
      }

    }

    watch(
      () => props.data,
      () => {
        state.tableData.splice(0, state.tableData.length, ...tableMethods.formatTableData(props.data))

        if (props.selectCache && tableMethods.getRawKey() !== '_id') { // 自定义Key并且开启了选择缓存, 内置随机id不支持选择缓存！
          tableMethods.cacheCheck()
        } else {
          state.checks.splice(0, state.checks.length)
          state.selectAll = CheckboxStatus.uncheck
        }
      },
      { deep: true, immediate: true }
    )

    return {
      refer: {
        refs,
        props,
        methods,
        tableData,
        checks: state.checks,
        state,
        handler
      },

      render: () => (
        <div class={tableClasses.value}>

          <table ref={onRef.table}>
            <SaThead
              thRows={tableRows.value}
              style={props.tableStyle?.thead}
              selectAll={state.selectAll}
              onCheckAll={tableMethods.checkAll}
              funPropIndexs={ funPropIndexs.value }
              onSortable={ tableHandle.tableDataSortable }
            />
            
          </table>
          
          <div style={{ ...stayles.value }}>
            <table>
              <SaTbody
                ref={onRef.tbody}
                class="sa-tbody"
                style={props.tableStyle?.tbody}
                clickIndex={ state.clickIndex }
                layout={{
                  trLen: props.data?.length,
                  tdLen: tableRows.value.length
                }}
              >
                {slots.default()}
              </SaTbody>
            </table>
          </div>
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