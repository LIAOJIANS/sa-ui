//@ts-nocheck

import { computed, defineComponent, handleError, reactive } from "vue";
import { SaTransfer, SaButton } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      data: [1, 5]
    })

    const handler = {
      onTransferChange: (val, dir) => {
        
        console.log('lalal',val);
        console.log('dir', dir);
        
      },

      onLeftChange: (val) => {
        console.log('左边',val);
      },

      onRightChange: (val) => {
        console.log('右边', val);
        
      }
    }

    const transferDatas = computed(() => new Array(10).fill('').map((c, i) => ({
      key: i,
      label: `测试${i}`,
      disabled: i % 4 === 0
    })))

    return () => <div>
      <SaTransfer
        v-model={ state.data }
        data={ transferDatas.value }
        filterable
        titles={['源', '目标']}
        rightDefaultChecked={ [5] }
        leftDefaultChecked={ [6] }
        onTransferChange={ handler.onTransferChange }
        onLeftChange={ handler.onLeftChange }
        onRightChange={ handler.onRightChange }
        v-slots={{
          leftFun: () => <SaButton size="mini" mode="plain" style={ { marginTop: '10px', marginLeft: '10px' } }>操作</SaButton>,
          rightFun: () => <SaButton size="mini" mode="plain" style={ { marginTop: '10px', marginLeft: '10px' } }>操作</SaButton>
        }}
      />
    </div>
  }
})