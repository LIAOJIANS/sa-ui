import { SaTable, SaTableColumn, SaButton, useMessage } from "sa-ui";
import { useRefs } from "sa-ui@hooks";
import { defineComponent, reactive } from "vue";

export default defineComponent({

  setup() {

    const { refs, onRef } = useRefs({
      table: SaTable
    })

    const $message = useMessage()

    const state = reactive({
      tableList: [
        { test1: 11, test2: 12, test3: 13,test4: 14,test5: 15 },
        { test1: 21, test2: 22, test3: 23,test4: 24,test5: 25 },
        { test1: 31, test2: 32, test3: 33,test4: 34,test5: 35 },
        { test1: 41, test2: 42, test3: 43,test4: 44,test5: 45 },
        { test1: 51, test2: 52, test3: 53,test4: 54,test5: 55 },
      ]
    })

    const methods = {
      getChekcs() {
        $message.info(
          JSON.stringify(
            refs
            .table
            ?.methods
            .getCheckedRaw()
          )
        );
        
      },

      getCheckByKeys() {
        $message.info(
          JSON.stringify(
            refs
            .table
            ?.methods
            .getCheckByKey()
          )
        );
      },

      setRowKeyByKey() {
        // methods
        //   .setCheckByRawKeys()
      },

      setRowKeyByRow() {
        refs
        .table
        ?.methods
          .setCheckByRaws(
            [ { test1: 11, test2: 12, test3: 13,test4: 14,test5: 15 },
              { test1: 21, test2: 22, test3: 23,test4: 24,test5: 25 }]
          )
      }
    }

    return () => (
      <div>
        <SaButton onClick={ methods.getChekcs }>获取选中Raw</SaButton>
        <SaButton onClick={ methods.getCheckByKeys }>获取选中Key</SaButton>
        <SaButton onClick={ methods.setRowKeyByKey }>根据rowKey设置选中状态</SaButton>
        <SaButton onClick={ methods.setRowKeyByRow }>根据row设置选中状态</SaButton>

        <SaTable
          data={state.tableList}
          ref={ onRef.table }
          style={{ marginTop: '10px' }}
          tableStyle={{
            thead: { 'text-align': 'center' },
            tbody: { 'text-align': 'center' }
          }}
        >
          <SaTableColumn
            selected
            width="50"
          />

          <SaTableColumn
            type="index"
            label="序号"
            prop="test1"
            width="50"
          />

          <SaTableColumn 
            label="测试表格1"
            prop="test1"
            align="left"
            width="180"
          />
          <SaTableColumn 
            label="测试表格2"
            prop="test2"
            width="180"
          />
          <SaTableColumn 
            label="测试表格3"
            prop="test3"
            width="180"
          />
          <SaTableColumn 
            label="测试表格4"
            prop="test4"
            width="180"
          />
          <SaTableColumn 
            label="测试表格5"
            prop="test5"
            align="right"
            v-slots={{
              default: ({ $index }: { $index: number }) => <>{ $index }</>
            }}
          >
          </SaTableColumn>
        </SaTable>
      </div>
    )
  }
})