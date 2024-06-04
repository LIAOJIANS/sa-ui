import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { PropType, computed, onMounted, reactive, watch, toRaw, createApp, h, ref } from "vue";

import { CheckboxStatus, classname, getElement, useRefs, useStyles } from "src/hooks";
import { FixedStatusEnum, TableAlignEnum, TableColumnRow } from "../SaTable/cros/table.type";
import { SaTableCollect } from "../SaTable/SaTable";
import SaIcon from '../SaIcon/SaIcon'
import SaCheckbox from "../SaCheckbox/SaCheckbox";
import { typeOf } from "js-hodgepodge";

// 下午攻克fixed 列固定

const SaTableColumn = designComponent({
  name: 'sa-table-column',

  props: {
    label: { type: String },                                                   // 表名标题
    prop: { type: String },                                                    // 绑定的指
    type: { type: String },                                                    // 当type为index时默认显示序号
    width: { type: [String, Number] },                                         // 单个单元格宽度
    align: { type: String as PropType<TableAlignEnum> },                       // 当前单元格的对齐方式
    selected: { type: Boolean },                                               // 是否开启选择表格
    sortable: { type: Boolean },                                               // 是否开启表头排序，默认为否
    fixed: { type: String as PropType<FixedStatusEnum> },                      // 是否固定列,必须明确fixed的位置
  },

  scopeSlots: {
    default: (row: any) => { },
    expand: (row: any) => { }
  },

  setup({ props, scopeSlots }) {
    const { onRef, refs } = useRefs({
      tableColumn: HTMLElement
    })

    let internalProps = reactive({ ...props, check: false, expand: '0' } as any)

    const classes = ref<string>('')
    const styles = ref({})

    const state = reactive({
      rowspan: 1,
      colspan: 1
    })

    const group = SaTableCollect.child()

    const tableRow = computed(() => {

      if (!!tableRowIndex.value || tableRowIndex.value == 0) {

        const column = {
          ...(group.tableData![tableRowIndex.value] || { row: {} }),
          props: toRaw(props),
          check: internalProps.check
        }

        return column
      }

      return {
        row: {}
      }
    })

    const tableRowIndex = computed(() => { // 列行
      const childrens = getElement(group.refs.tbody)?.children || []

      if (childrens.length < 1) {
        return null
      }

      return methods.getColumnIndex(childrens, refs.tableColumn?.parentElement)
    })

    const rowIndex = computed(() => {

      const trs = getElement(refs.tableColumn?.parentElement)?.children

      return methods.getColumnIndex(trs, refs.tableColumn)
    })

    const expendStyle = useStyles(style => {

      style.cursor = 'pointer'

      if (internalProps.expand === '2') {
        style.transform = 'rotate(90deg)'
      }

    })

    const methods = {

      getColumnIndex: (
        childrens: any,
        child: any
      ) => [].indexOf.call(childrens, child as never),

      getSpan: () => {
        let rowspan = 1
        let colspan = 1

        if (typeOf(group.props.spanMethods) === 'function') {
          const result = group.props.spanMethods?.(
            toRaw(tableRow.value.row),
            (tableRow.value as any).props,
            (tableRow.value as any).columnIndex - 1,
            rowIndex.value,
          )!

          if (typeOf(result) === 'array') {
            rowspan = result[0]
            colspan = result[1]
          } else if (typeOf(result) === 'object') {
            rowspan = result.rowspan
            colspan = result.colspan
          }
        }

        state.colspan = colspan
        state.rowspan = rowspan

        return {
          rowspan,
          colspan
        }
      },

      addExpandTr: () => { // 获取tbody虚拟dom 根据当前索引往下一位插入tr

        const tr = document.createElement('tr')

        // @ts-ignore
        const content = scopeSlots.expand(tableRow.value)![0]

        const app = createApp({
          render() {
            return h(
              'div',
              null,
              content
            )
          }
        })

        app.mount(tr) // 挂载并转为真实Dom

        const borderDom = refs.tableColumn?.parentElement!.nextSibling

        const tobdy = getElement(group.refs.tbody)
        if (borderDom) {

          tobdy!.insertBefore(
            tr,
            borderDom!
          )
        }
      },

      delExpandTr: () => refs.tableColumn?.parentElement!.nextSibling?.remove()
    }

    const handler = {
      handleOpenTableColl: (e: MouseEvent) => {
        e.stopPropagation()

        internalProps.expand = (internalProps.expand === '0' || internalProps.expand === '1') ? '2' : '1'
        internalProps.expand === '2' ? methods.addExpandTr() : methods.delExpandTr()
      }
    }

    watch(() => [group.checks, group.state.sortStatus], () => {

      internalProps.check = group.checks.includes((tableRow.value as any)['_id'])
    }, { deep: true, immediate: true })



    onMounted(() => { // 更新内部data的数据状态
      group.tableData.splice(tableRowIndex.value!, 1, tableRow.value as TableColumnRow)

      // 合并单元格操作
      if (group.props.spanMethods) {
        methods
          .getSpan()
      }

      if (!!props.fixed) {
        watch(
          group.tableFixed.fixedClass(props.fixed!, rowIndex),
          val => {

            classes.value = classname([
              'sa-table-cell',
              {
                'sa-table-cell--fixed': !!props.fixed,
                [`sa-table-algin-${props.align}`]: !!props.align
              }
            ],
            ...val
            )
          })
      }

      styles.value = group.tableFixed.styles(props.fixed!, rowIndex).value
    })

    return {
      refer: {
        props: {
          ...internalProps
        }
      },
      render: () => <>
        {
          (!state.colspan || !state.rowspan) ? null : (

            <td
              ref={onRef.tableColumn}
              colspan={state.colspan}
              rowspan={state.rowspan}
              class={classes.value}
              style={{ ...styles.value }}
            >
              <div class="sa-table-item">
                {/* {JSON.stringify(classes.value)} */}
                {
                  internalProps.selected! ? (
                    <SaCheckbox
                      v-model={internalProps.check}
                      onChangeStatus={(e: CheckboxStatus) => {
                        group.methods.checkStautsCheck(e, (tableRow.value as any)['_id'])
                      }}
                    />
                  ) : (
                    scopeSlots.default(tableRow.value,
                      <>
                        {
                          (internalProps.type && internalProps.type === 'index')
                            ? tableRowIndex.value! + 1
                            : internalProps.type === 'expand'
                              ? <SaIcon
                                icon="el-icon-caret-right"
                                style={{ ...expendStyle.value }}
                                class="sa-table-item--expand"
                                size={22}
                                onClick={(e: MouseEvent) => handler.handleOpenTableColl(e)}
                              />
                              : (tableRow.value as any).row[internalProps.prop!]
                        }
                      </>
                    )
                  )
                }
              </div>
            </td>
          )
        }
      </>
    }
  }
})

export default SaTableColumn