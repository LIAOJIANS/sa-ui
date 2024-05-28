import { ComputedRef, computed, reactive, watch } from "vue";
import { ColumnProp, FixedStatusEnum, TableAlignEnum } from "../cros/table.type";
import { createEventHandler } from 'js-hodgepodge'

export function useTableFixed({
  tableRows,
  isFixed
}: {
  tableRows: ComputedRef<{ rowIndex: number, props: ColumnProp }[]>,
  isFixed: ComputedRef<{
    fixedes: number[],
  }>
}) {

  const scrollState = reactive<{
    scrollFiexdType: TableAlignEnum | null,
    width: number,
    difference: number,
    notWidht: number,
    isGreater: boolean
  }>({
    scrollFiexdType: null,
    width: 0,                          // 表格宽度
    difference: 0,                     // 超过默认宽度的差值
    notWidht: 0,                       // 未设置宽度的子单元格个数
    isGreater: false                   // 子单元总宽是否大于默认宽度
  })


  const freeWidth = {
    tableWidth: (table: HTMLElement) => {
      let width = table.offsetWidth || 0
  
        let childWidth = 0
        let notWidht = 0
  
        tableRows.value
          .forEach(({ props }) => {
            childWidth += Number(props.width || 0)
  
            if (!props.width) {
              notWidht += 1
            }
          })

        scrollState.width =  width > childWidth ? width : childWidth
        scrollState.difference = width - childWidth,
        scrollState.notWidht = notWidht
        scrollState.isGreater = width < childWidth
    },

    windowResize: () => {

      if(isFixed.value?.fixedes.length > 0) { // 如果存在Fiexd，则开启窗口resize监听
        console.log(1);
        
      }
    }
  }

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
      scrollState.scrollFiexdType = target.scrollLeft === Math.abs(scrollState.difference)
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
        scrollState.difference < 0
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

  const childWidth = computed(() => {
    if (scrollState.isGreater) {
      return 80
    }

    const avgWidth = Math.floor(scrollState.difference / scrollState.notWidht)

    return avgWidth > 80 ? avgWidth : 80
  })



  return {
    handleTableScroll,
    fixedClass,

    freeWidth,
    scrollState,
    childWidth
  }
}