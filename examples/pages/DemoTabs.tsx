import { defineComponent, reactive } from "vue";
import { SaTabs, SaTabPane, SaButton, SaRadio, SaTree, SaTable, SaTableColumn } from "sa-ui";

export default defineComponent({

  setup() {

    const handler = {
      handlePanesChange: (val: any) => {
        console.log(val);
      }
    }

    const state = reactive({
      panesValue: 'button',

      data1: [
        {
          title: '节点1',
          data: [
            {
              title: '节点1-1',
              data: [
                {
                  title: '节点1-1-1',
                  data: [
                    {
                      title: '节点1-1-1-1'
                    },
                    {
                      title: '节点1-1-2-2'
                    },
                    {
                      title: '节点1-1-3-3'
                    }
                  ]
                },
                {
                  title: '节点1-1-2',
                  data: [
                    {
                      title: '节点1-1-2-2'
                    },
                    {
                      title: '节点1-1-3-3'
                    }
                  ]
                },
                {
                  title: '节点1-1-3'
                }
              ]
            },
            {
              title: '节点1-2'
            }
          ]
        },
        {
          title: '节点2',
          data: [
            {
              title: '节点2-1',
            }
          ]
        }
      ],

      tableList1: [
        { test1: 11, test2: 12, test3: 13,test4: 14,test5: 15 },
        { test1: 21, test2: 22, test3: 23,test4: 24,test5: 25 },
        { test1: 31, test2: 32, test3: 33,test4: 34,test5: 35 },
        { test1: 41, test2: 42, test3: 43,test4: 44,test5: 45 },
        { test1: 51, test2: 52, test3: 53,test4: 54,test5: 55 },
      ],

      panes: [
        { name: 'Tab' },
        { name: 'Tab' },
        { name: 'Tab' },
        { name: 'Tab' }
      ]
    })
    return () => <div>
      <SaTabs v-model={state.panesValue} onChange={handler.handlePanesChange}>
        <SaTabPane label="SaButton" paneKey="button">
          <SaButton>Button</SaButton>
        </SaTabPane>

        <SaTabPane label="SaRadio" paneKey="Radio">
          <SaRadio>SaRadio</SaRadio>
        </SaTabPane>

        <SaTabPane label="SaTree" paneKey="Tree">
          <SaTree
            data={ state.data1 }
            props={{
              label: 'title',
              childrens: 'data'
            }}
            highlightCurrent
            accordion
          />
        </SaTabPane>

        <SaTabPane label="SaTable" paneKey="table">
          <SaTable
            data={state.tableList1}
            border
          >
            <SaTableColumn 
              label="测试表格1"
              prop="test1"
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
            >
            </SaTableColumn>
          </SaTable>
        </SaTabPane>
      </SaTabs>
    </div>
  }
})