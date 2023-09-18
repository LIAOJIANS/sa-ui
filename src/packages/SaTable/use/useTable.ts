import { reactive } from "vue";

export function useTable() {

  let state = reactive({
    selectAll: 'unckeck'
  })

  
  const methods = {
  }

  return {
    state,
    methods
  }
  
}