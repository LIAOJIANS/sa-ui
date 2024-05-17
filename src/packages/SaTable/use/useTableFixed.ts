import { reactive, ComputedRef } from "vue";
import { FixedStatusEnum, TableAlignEnum } from "../cros/table.type";
import {} from 'js-hodgepodge'

export function useTableFixed({
  tableWidht
}: {
  tableWidht: ComputedRef<{
    difference: number
  }>
}) {
  const scrollState = reactive<{
    scrollFiexdType: TableAlignEnum | null
  }>({
    scrollFiexdType: null
  })

  const handleTableScroll = (e: Event) => {
    const target = e.target as HTMLDivElement
    /*
      如果滚动left 大于0 且等于差值，则为left
      如果滚动left 大于0 且小于差值，则为center
      如果滚动left = 0 则为left
    */
      
    if(target.scrollLeft === 0) {
      scrollState.scrollFiexdType = TableAlignEnum.right
    } else {
      scrollState.scrollFiexdType = target.scrollLeft === Math.abs(tableWidht.value.difference)
        ? TableAlignEnum.left : TableAlignEnum.center
    }
  }

  const fixedClass = (
    fixed: FixedStatusEnum
  ) => {
    let fixedClass = []

      if(
        !!fixed && 
        fixed === 'right' && 
        tableWidht.value.difference < 0
      ) {
        fixedClass.push('sa-cell-fixed-right')
      }

      if(scrollState.scrollFiexdType === TableAlignEnum.center) {
        fixedClass = []
        fixedClass.push(`sa-cell-fixed-${fixed}`)
      } else if (scrollState.scrollFiexdType === TableAlignEnum.left) {
        fixedClass = []
       
        fixed === FixedStatusEnum.left && fixedClass.push(`sa-cell-fixed-left`)

      } else if(scrollState.scrollFiexdType === TableAlignEnum.right) {
        fixedClass = []

        fixed === FixedStatusEnum.right && fixedClass.push(`sa-cell-fixed-right`)
      }

      return fixedClass
  }

  return {
    handleTableScroll,
    fixedClass,
    
    scrollState
  }
}