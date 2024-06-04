import { ComputedRef, computed, reactive } from "vue";
import { ColumnProp, FixedStatusEnum, TableAlignEnum } from "../cros/table.type";
import { unit, useStyles } from "sa-ui@hooks";

export function useTableFixed({
  tableRows,
  funPropIndexs,
  getRowByIndex
}: {
  tableRows: ComputedRef<{ rowIndex: number, props: ColumnProp }[]>,
  funPropIndexs: ComputedRef<{
    isFixed: boolean,
    fixedes: Map<string, number[]>
  }>,
  getRowByIndex: (columnIndex: number[]) => ({ widths: Record<number, number>, widthNum: number })
}) {

  const scrollState = reactive<{
    scrollFiexdType: TableAlignEnum | null,
    width: number,
    difference: number,
    notWidht: number,
    isGreater: boolean,
  }>({
    scrollFiexdType: null,
    width: 0,                          // 表格宽度
    difference: 0,                     // 超过默认宽度的差值
    notWidht: 0,                       // 未设置宽度的子单元格个数
    isGreater: false,                   // 子单元总宽是否大于默认宽度
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

      const theWidth = (width > childWidth ? width : childWidth)

      scrollState.width = theWidth > 360 ? theWidth : 360 // 最小默认宽度360
      scrollState.difference = width - childWidth,
      scrollState.notWidht = notWidht
      scrollState.isGreater = width < childWidth
    },

    windowResize: (table: HTMLElement) => {

      if (funPropIndexs.value?.isFixed) { // 如果存在Fiexd，则开启窗口resize监听
        window.addEventListener('resize', (e: Event) => {

          freeWidth.tableWidth(table)

        })
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

    if (target.scrollLeft === 0) {
      scrollState.scrollFiexdType = TableAlignEnum.right
    } else {
      scrollState.scrollFiexdType = target.scrollLeft === Math.abs(scrollState.difference)
        ? TableAlignEnum.left : TableAlignEnum.center
    }
  }

  const fixedClass = (
    fixed: FixedStatusEnum,
    columnIndex: ComputedRef<number>,
    // classes: ISingleClass[]
  ) => computed(() => {
    /**
     * 
      需要当前单元格的行列索引，有个问题，
      设计时调用者皆是computed，dom还没渲染时就被调用了，难道只能用宏任务去规避了？
     */

    /*
      center: left and right
      left - left: just let 
      right - right just right


      fixeds 存在多个的情况：   Map<string, number[]>
      left: fixeds[fixeds.length - 1]
      right: fieds[0]
    */

      let fixedClass = [] as string[]

      if (!fixed || scrollState.difference > 0) { 
        return []
      }
  
      // if(columnIndex.value > 5) {
      //   debugger
      // }
  
      const isMoreFiexds = funPropIndexs.value.fixedes.get(fixed)?.length! > 1
  
      if (isMoreFiexds && (!!columnIndex?.value || columnIndex?.value === 0)) {
  
        const fixeds = funPropIndexs.value.fixedes.get(fixed)!
        
        if (
          (
            fixed === FixedStatusEnum.right &&
            columnIndex?.value !== fixeds[0]
          ) || (
            fixed === FixedStatusEnum.left &&
            columnIndex?.value !== fixeds[fixeds.length - 1]
          )
        ) {
          return []
        }
      }

    if (
      fixed === 'right' &&
      scrollState.difference < 0
    ) {
      fixedClass.push('sa-cell-fixed-right')
    }

    if (scrollState.scrollFiexdType === TableAlignEnum.center) {
      fixedClass = []
      fixedClass.push(`sa-cell-fixed-${fixed}`)
    } else if (scrollState.scrollFiexdType === TableAlignEnum.left) {
      fixedClass = []

      fixed === FixedStatusEnum.left && fixedClass.push(`sa-cell-fixed-left`)

    } else if (scrollState.scrollFiexdType === TableAlignEnum.right) {
      fixedClass = []

      fixed === FixedStatusEnum.right && fixedClass.push(`sa-cell-fixed-right`)
    }
    
    return fixedClass
  })

  const childWidth = computed(() => {
    if (scrollState.isGreater) {
      return 80
    }

    const avgWidth = Math.floor(scrollState.difference / scrollState.notWidht)

    return avgWidth > 80 ? avgWidth : 80
  })

  const styles = (
    fixed: FixedStatusEnum,
    columnIndex: ComputedRef<number>
  ) => useStyles(style => {

    // delay() // 转为宏任务，等待下一次执行
    //   .then(() => {
    if (!!fixed) {
      style.position = 'sticky'
      const { widths } = getRowByIndex(
        funPropIndexs.value.fixedes.get(fixed)!
      )

      let columWidth = 0
      const w = Object.entries(widths)

      w.forEach(([k, v]) => {

        const toNumK = parseInt(k, 10)

        if (
          (toNumK <= columnIndex.value && fixed === FixedStatusEnum.left) ||
          (toNumK >= columnIndex.value && fixed === FixedStatusEnum.right)
        ) {
          columWidth += v as number
        }

      })

      style[fixed] = unit(columWidth)
      style.zIndex = 1
    }
    // })

  })

  return {
    handleTableScroll,
    fixedClass,
    styles,

    freeWidth,
    scrollState,
    childWidth
  }
}