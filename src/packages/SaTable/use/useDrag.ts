import { reactive } from "vue"
import { TableColumnRow } from "../cros/table.type"
import { getElement } from "src/hooks/utils/getElement"

export const useDrag = () => {
  
  const dragState = reactive({
    dragIngItem: {},
    dragIndex: -1,
    dragTarIndex: -1,
    startY: 0,
    distanceY: -1
  } as {
    dragIngItem: TableColumnRow,
    dragIndex: number,
    dragTarIndex: number,
    startY: number,
    distanceY: number
  })
  
  const handler = {
    
  }

  const methods = {
    moveRows: (
      index: number, 
      tbody: any,
      e: DragEvent,
    ) => {
      // dragState.distanceY = e.clientY - dragState.startY
      
      const el = getElement(tbody)

      console.log(index, dragState.dragIndex);


      if(dragState.dragIndex !== index) {
        const dragRow = el!.children[dragState.dragIndex]
        const targetRow = el!.children[index]

        el!.insertBefore(dragRow, targetRow.nextSibling)

        if(!targetRow.nextSibling) {
          el!.appendChild(targetRow)
          el!.insertBefore(targetRow, dragRow)
        }
        dragState.dragIndex = index
      }

      

      // tbodyFragment.appendChild(
      //   el!.children
      // )

      // const dragRow = tableData[index]
      // const targetRow = tableData[targetIndex]

      // if(dragState.dragIngItem) {
      //   console.log(dragState.dragIndex, index);
        
      //   tableData.splice(dragState.dragIndex, 1)
      //   tableData.splice(index, 0, dragState.dragIngItem)
        
      //   console.log(tableData)
      // }
    },

    getRowIndexByHeight: (dragHeight: number, rowHeight: number) => Math.floor(dragHeight / rowHeight),

    setCurDrag: (row: TableColumnRow | {}, index: number, e: DragEvent) => {
      dragState.dragIndex = index
      dragState.dragIngItem = row as TableColumnRow
      dragState.startY = e.clientY
    }
  }

  return {
    handler,
    methods,
    dragState
  }

} 