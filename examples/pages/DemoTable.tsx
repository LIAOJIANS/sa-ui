import { SaTable, SaTableColumn } from "sa-ui";
import { defineComponent, reactive } from "vue";

export default defineComponent({

  setup() {

    const state = reactive({
      tableList: [
        { test1: 1, test2: 1, test3: 1,test4: 1,test5: 1 },
        { test1: 2, test2: 2, test3: 2,test4: 2,test5: 2 },
        { test1: 3, test2: 3, test3: 3,test4: 3,test5: 3 },
        { test1: 4, test2: 4, test3: 4,test4: 4,test5: 4 },
        { test1: 5, test2: 5, test3: 5,test4: 5,test5: 5 },
      ]
    })

    return () => (
      <SaTable
        data={state.tableList}
      >
        <SaTableColumn 
          label="测试表格1"
          prop="test1"
        />
         <SaTableColumn 
          label="测试表格2"
          prop="test2"
        />
         <SaTableColumn 
          label="测试表格3"
          prop="test3"
        />
         <SaTableColumn 
          label="测试表格4"
          prop="test4"
        />
         <SaTableColumn 
          label="测试表格5"
          prop="test5"
        />
      </SaTable>
    )
  }
})