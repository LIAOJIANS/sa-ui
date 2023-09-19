import { CheckboxStatus } from "src/hooks";
import { reactive } from "vue";
import { TableColumnRow } from "../cros/table.type";

export function useTable() {

  let state = reactive({
    checks: [],
    selectAll: CheckboxStatus.uncheck
  } as {
    checks: any[],
    selectAll: CheckboxStatus
  })

  
  const methods = {
    setCheckAll: (
      status: CheckboxStatus, 
      id: string, 
      dataLen: number
    ) => {
      
      if(status === CheckboxStatus.check) {
        state.checks.indexOf(id) === -1 && (
          state.checks.push(id)
        )
      }

      if(status === CheckboxStatus.uncheck) {
        state.checks.indexOf(id) > -1 && (
          state.checks = state.checks.filter(c => c !== id)
        )
      }

      state.selectAll = state.checks.length === dataLen ? 
        CheckboxStatus.check : 
          state.checks.length > 0 ? CheckboxStatus.minus : CheckboxStatus.uncheck
    },
    
    formatTableData: (data: TableColumnRow[], rowKey?: string) => {
      rowKey = rowKey || '_id'

      return data.map(c => ({ ...c, _id: methods.randomId() + methods.randomId() }))
    },

    
    randomId: () => Math.random().toString(16).slice(2, 40),
    
  }

  return {
    state,
    methods
  }
  
}