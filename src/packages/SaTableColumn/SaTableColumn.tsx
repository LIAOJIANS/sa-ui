import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { PropType, computed, onMounted, reactive, watch, toRaw } from "vue";

import { CheckboxStatus, getElement, useRefs, useStyles } from "src/hooks";
import { TableAlignEnum, TableColumnRow } from "../SaTable/cros/table.type";
import { SaTableCollect } from "../SaTable/SaTable";
import SaCheckbox from "../SaCheckbox/SaCheckbox";

const SaTableColumn = designComponent({
  name: 'sa-table-column',

  props: {
    label: { type: String },                                                   // 表名标题
    prop: { type: String },                                                    // 绑定的指
    type: { type: String },                                                    // 当type为index时默认显示序号
    width: { type: [String, Number] },                                         // 单个单元格宽度
    align: { type: String as PropType<TableAlignEnum> },                       // 当前单元格的对齐方式
    selected: { type: Boolean },                                               // 是否开启选择表格
  },

  scopeSlots: {
    default: (row: any) => { }
  },

  setup({ props, scopeSlots }) {
    const { onRef, refs } = useRefs({
      tableColumn: HTMLElement
    })

    let internalProps = reactive({...props, check: false} as any)

    const group = SaTableCollect.child()

    const tableRow = computed(() => {

      if(!!tableRowIndex.value || tableRowIndex.value == 0) {
        
        const column = {
          ...(group.tableData![tableRowIndex.value] || {row:{}}),
          props: toRaw(props),
          check: internalProps.check
        }

        return column
      }

      return {
        row: {}
      }
    })
  
    const tableRowIndex = computed(() => {
      const childrens = getElement(group.refs.tbody)?.children || []

      if(childrens.length < 1) {
        return null
      }

      return methods.getColumnIndex(childrens, refs.tableColumn?.parentElement)
    })

    const columStyle = useStyles(style => {

      if(props.width) {
        style.width = `${props.width}`.indexOf('px') > -1 ? props.width : `${props.width}px`
      }

      if(props.align) {
        style["text-align"] = props.align
      }

      return style
    })

    const methods = {
      getColumnIndex: (
        childrens: any,
        child: any
      ) => [].indexOf.call(childrens, child as never)
    }

    watch(() => group.checks, () => {
      
      internalProps.check = group.checks.includes((tableRow.value as any)[group.props.rowKey || '_id'])
    }, { deep: true })
    
    onMounted(() => { // 更新内部data的数据状态
      group.tableData.splice(tableRowIndex.value!, 1, tableRow.value as TableColumnRow)
    })
    
    return {
      refer: {
        props: {
          ...internalProps
        }
      },
      render: () => <td ref={ onRef.tableColumn } style={{ ...columStyle.value }}>
        <div class="sa-table-item">
          {
            internalProps.selected! ? (
              <SaCheckbox 
                v-model={ internalProps.check }
                onChangeStatus={ (e: CheckboxStatus) => {
                  group.methods.checkStautsCheck(e, (tableRow.value as any)[group.props.rowKey || '_id'])
                } }
              />
            ) : (
              scopeSlots.default(tableRow.value,
                <>{ (internalProps.type && internalProps.type === 'index') ? 
                  tableRowIndex.value! + 1 : (tableRow.value as any).row[internalProps.prop!]}</>
              )
            )
          }
        </div>
      </td>
    }
  }
})

export default SaTableColumn