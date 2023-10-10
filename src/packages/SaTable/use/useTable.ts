import { typeOf } from "js-hodgepodge";
import { CheckboxStatus } from "src/hooks";
import { reactive, watch } from "vue";
import { TableColumnRow } from "../cros/table.type";

export function useTable(
  data: TableColumnRow[],
  {
    rowKey,
    selectCache
  }: {
    rowKey?: string,
    selectCache?: boolean
  }
) {

  let state = reactive({
    checks: [],
    selectAll: CheckboxStatus.uncheck,
    tableData: []
  } as {
    checks: any[],
    selectAll: CheckboxStatus,
    tableData: TableColumnRow[]
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
        props: {}
      }))
      
    },

    getRawKey: () => (rowKey || '_id') as keyof TableColumnRow,

    randomId: () => Math.random().toString(16).slice(2, 40),

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

      const key = methods.getRawKey()

      return state.tableData.filter((c: TableColumnRow) => state.checks.includes(c[key]))
    }
  }


  return {
    state,
    methods,
    tableData: state.tableData,
    exposeMethods
  }

}