import { typeOf } from "js-hodgepodge";
import { CheckboxStatus } from "src/hooks";
import { reactive, watch } from "vue";
import { SortableStatusEnum, TableColumnRow } from "../cros/table.type";

export function useTable(
  {
    rowKey
  }: {
    rowKey?: string,
    selectCache?: boolean
  }
) {

  let state = reactive({
    checks: [],
    selectAll: CheckboxStatus.uncheck,
    tableData: [],
    clickIndex: -1,
    sortStatus: null
  } as {
    checks: any[],
    selectAll: CheckboxStatus,
    tableData: TableColumnRow[],
    clickIndex: number,
    sortStatus: SortableStatusEnum | null
  })
  
  const methods = {
    setCheck: (
      status: CheckboxStatus,
      id: string,
      dataLen: number
    ) => {
      
      if (status === CheckboxStatus.check) {
        state.checks.indexOf(id) === -1 && (
          state.checks.push(id)
        )
      }

      if (status === CheckboxStatus.uncheck) {
        state.checks.indexOf(id) > -1 && (
          state.checks.splice(state.checks.findIndex(c => c === id), 1)
        )
      }

      state.selectAll = state.checks.length === dataLen ?
        CheckboxStatus.check :
        state.checks.length > 0 ? CheckboxStatus.minus : CheckboxStatus.uncheck
    },

    checkAll: (
      status: CheckboxStatus
    ) => {

      if (status === CheckboxStatus.check) {
        state.tableData.forEach(c => {
          !state.checks.includes(c._id) && (
            state.checks.push(c._id)
          )
        })
      } else if (status === CheckboxStatus.uncheck) {
        state.checks.splice(0, state.checks.length)
      }
      
    },

    cacheCheck: () => { // 开启选择缓存时改变全选状态
      if(state.selectAll === CheckboxStatus.uncheck) {
        return
      }

      if(state.checks.length < state.tableData.length && state.selectAll !== CheckboxStatus.minus) {
        state.selectAll = CheckboxStatus.minus
      }
    },

    formatTableData: (tableList: any) => {
      return tableList.map((c: any, i: number) => ({
        row: c,
        _id: rowKey ? (c as any)[rowKey!] : methods.randomId() + methods.randomId(),
        columnIndex: i + 1,
        $index: i,
        props: {},
        check: false
      }))
      
    },

    getRawKey: () => (rowKey || '_id') as keyof TableColumnRow,

    randomId: () => Math.random().toString(16).slice(2, 40),

    setCurrentRow: (index: number) => state.clickIndex = index
  }

  const handler = {
    tableDataSortable: (
      sortStatus: SortableStatusEnum, 
      prop: string
    ) => {
      if(state.checks.length > 0) {
        state.sortStatus = sortStatus // 为了触发column更新check数据
      }
      
      if(sortStatus === SortableStatusEnum.Asce) { // 升序
        // @ts-ignore
        state.tableData = state.tableData.sort((a, b) => (a.row[prop] - b.row[prop]))
      }

      if(sortStatus === SortableStatusEnum.Desc) { // 降序
        // @ts-ignore
        state.tableData = state.tableData.sort((a, b) => (b.row[prop] - a.row[prop]))
      }

    },
  }

  const exposeMethods = {

    setCheckByRawKeys: (keys: any, status?: boolean) => {

      if (!rowKey) {
        return console.error('Must be bound RawKey!!!')
      }

      if (typeOf(keys) !== 'array') {
        keys = [keys]
      }

      keys
        .forEach((k: any) => {

          status = typeOf(status) === 'boolean' ? status : !state.checks.includes(k)

          status === true ? (
            !state.checks.includes(k) &&
            state.checks.push(k)
          ) : (
            state.checks.includes(k) && (
              state.checks.splice(state.checks.findIndex(c => c === k), 1)
            )
          )

        })
    },

    getCheckedRaw: () => {

      if (state.selectAll === CheckboxStatus.check) {
        return state.tableData
      }

      if (state.selectAll === CheckboxStatus.uncheck) {
        return []
      }

      const key = "_id"

      return state.tableData.filter((c: TableColumnRow) => state.checks.includes(c[key]))
    }
  }

  return {
    state,
    methods,
    tableData: state.tableData,
    exposeMethods,
    handler
  }

}