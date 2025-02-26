import { SaTable, SaTableColumn, SaButton, useMessage } from "sa-ui";
import { useRefs } from "sa-ui@hooks";
import { defineComponent, reactive, computed, ref } from "vue";
import DemoContainer from '../components/container'

export default defineComponent({

  setup() {

    const { refs, onRef } = useRefs({
      table: SaTable
    })

    const $message = useMessage()

    const state = reactive({
      sort: false,
      zebra: false,
      tableHeight: 0,
      highlightCurrentRow: false,
      tableList1: [
        { test1: 11, test2: 12, test3: 13,test4: 14,test5: 15 },
        { test1: 21, test2: 22, test3: 23,test4: 24,test5: 25 },
        { test1: 31, test2: 32, test3: 33,test4: 34,test5: 35 },
        { test1: 41, test2: 42, test3: 43,test4: 44,test5: 45 },
        { test1: 51, test2: 52, test3: 53,test4: 54,test5: 55 },
      ],

      tableList: [
        { test1: 11, test2: 12, test3: 13,test4: 14,test5: 15, id: 0 },
        { test1: 21, test2: 22, test3: 23,test4: 24,test5: 25, id: 1 },
        { test1: 31, test2: 32, test3: 33,test4: 34,test5: 35, id: 2 },
        { test1: 41, test2: 42, test3: 43,test4: 44,test5: 45, id: 3 },
        { test1: 51, test2: 52, test3: 53,test4: 54,test5: 55, id: 4 },
      ],

      initTimeText: `
        const state = reactive({
          tableList1: [
            { test1: 11, test2: 12, test3: 13,test4: 14,test5: 15 },
            { test1: 21, test2: 22, test3: 23,test4: 24,test5: 25 },
            { test1: 31, test2: 32, test3: 33,test4: 34,test5: 35 },
            { test1: 41, test2: 42, test3: 43,test4: 44,test5: 45 },
            { test1: 51, test2: 52, test3: 53,test4: 54,test5: 55 },
          ]
        })

        <SaTable
          data={state.tableList1}
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
      `,

      initTimeText1: `
        const state = reactive({
          tableList1: [
            { test1: 11, test2: 12, test3: 13,test4: 14,test5: 15 },
            { test1: 21, test2: 22, test3: 23,test4: 24,test5: 25 },
            { test1: 31, test2: 32, test3: 33,test4: 34,test5: 35 },
            { test1: 41, test2: 42, test3: 43,test4: 44,test5: 45 },
            { test1: 51, test2: 52, test3: 53,test4: 54,test5: 55 },
          ]
        })

        const methods = {
          /*
            SpanMethods = ( row: Record<string, string>, column: any, rowIndex: number, columnIndex: number ) => number[] & {
              rowspan: number,
              colspan: number
            }
          */
          spanMethods(row, column, rowIndex, columnIndex) {
            if (rowIndex % 2 === 0) {
              if (columnIndex === 0) {
                return [1, 2];
              } else if (columnIndex === 1) {
                return [0, 0];
              }
            }
          }
        }

        <SaTable
          data={state.tableList1}
          spanMethods={ methods.spanMethods }
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
      `
    })

    const methods = {
      changeTableData() {
        //@ts-ignore
        state.tableList = [...state.tableList, ...state.tableList].map((c, i) => ({...c, id: i}))
      },

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
        refs
        .table
        ?.methods
          .setCheckByRawKeys([0, 1, 4, 9])
      },

      setRowKeyByRow() {
        refs
        .table
        ?.methods
          .setCheckByRaws(
            [ { test1: 11, test2: 12, test3: 13,test4: 14,test5: 15, id: 9 },
              { test1: 21, test2: 22, test3: 23,test4: 24,test5: 25, id: 1 }]
          )
      },

      openSort() {
        state.sort = true
      },

      //@ts-ignore
      spanMethods(row, column, rowIndex, columnIndex) {
        if (rowIndex % 2 === 0) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
      },

      regularGaug() {
        state.tableHeight = 500
      }
    }

    // const num = ref<any>(0)

    // let obj = reactive({
    //   a: 1, 
    //   b: 2
    // })

    // const comp = computed(() => {
    //   return obj.a + obj.b
    // })

    // num.value = comp.value


    return () => (
      <div>
        {/* { num.value }

        <button onClick={() => (obj.a += obj.b) }>111</button> */}

        <h1 style={{ color: '#333' }}>Table 表格</h1>
        <span style={{ color: '#666', fontSize: '14px' }}>用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。</span>
        <DemoContainer
          label="基础表格"
          describe="基础的表格展示用法。"
          codeText={state.initTimeText}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaTable
              data={state.tableList1}
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
          </div>
        </DemoContainer>

        <DemoContainer
          label="合并行或列"
          describe="多行或多列共用一个数据时，可以合并行或列。"
          codeText={state.initTimeText1}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaTable
              data={state.tableList1}
              spanMethods={ methods.spanMethods }
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
          </div>
        </DemoContainer>

        <DemoContainer
          label="功能开发测试"
          describe="基础的表格展示用法。"
          codeText={state.initTimeText}
        >
          {/* @ts-ignore */}
          <div slot="title">
          <SaButton onClick={ methods.getChekcs }>获取选中Raw</SaButton>
          <SaButton onClick={ methods.getCheckByKeys }>获取选中Key</SaButton>
          <SaButton onClick={ methods.setRowKeyByKey }>根据rowKey设置选中状态</SaButton>
          <SaButton onClick={ methods.setRowKeyByRow }>根据row设置选中状态</SaButton>
          <SaButton onClick={ () => state.highlightCurrentRow = true }>高亮点击行</SaButton>
          <SaButton onClick={ () => refs.table?.methods.setCurrentRow({ test1: 21, test2: 22, test3: 23,test4: 24,test5: 25, id: 1 }) }>根据row设置高亮状态</SaButton> 
          <p style={{ padding: '5px 0', margin: 0 }}></p>
          <SaButton onClick={ methods.changeTableData }>选中状态缓存</SaButton>
          <SaButton onClick={ methods.openSort }>开启sort排序</SaButton>
          <SaButton onClick={ methods.regularGaug }>固定表头</SaButton>
          <SaButton onClick={ () => state.zebra = true }>开启斑马行</SaButton>
          <SaTable
            data={state.tableList}
            ref={ onRef.table }
            style={{ marginTop: '10px' }}
            tableStyle={{
              thead: { 'text-align': 'center' },
              tbody: { 'text-align': 'center' }
            }}
            onClickRow={ (row: Record<string, any>) => console.log(row)}
            selectCache
            border
            maxHeight={ state.tableHeight }
            rowKey="id"
            highlightCurrentRow={ state.highlightCurrentRow }
            zebra={ state.zebra }
          >
             <SaTableColumn
              width="50"
              type="expand"
              fixed="left"
              v-slots={{
                expand: ({ row }: any) => <div>1
                  <p>
                    <span>test1：{ row.test1 }</span>
                  </p>
                </div>
              }}
            />

            <SaTableColumn
              selected
              width="50"
              fixed="left"
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
              sortable={ state.sort }
            />
            <SaTableColumn 
              label="测试表格2"
              prop="test2"
              width="360"
              sortable={ state.sort }
            />
            <SaTableColumn 
              label="测试表格3"
              prop="test3"
              width="110"
            />
            <SaTableColumn 
              label="测试表格4"
              prop="test4"
              fixed="right"
              width="110"
            />
            <SaTableColumn 
              label="测试表格5"
              prop="test5"
              align="right"
              fixed="right"
              width="110"
              v-slots={{
                default: ({ $index }: { $index: number }) => <>{ $index }</>
              }}
            >
            </SaTableColumn>
          </SaTable>
          </div>
        </DemoContainer>


        
        <DemoContainer
          label="拖拽表格"
          describe="表格开启拖拽功能"
          codeText='' 
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaTable
              data={state.tableList1}
              drag
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
          </div>
        </DemoContainer>
      </div>
    )
  }
})
